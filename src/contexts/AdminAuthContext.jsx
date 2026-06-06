import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { saveTokens, clearTokens } from '@/utils/tokenStorage';
import { setupTokenRefreshInterval } from '@/utils/tokenRefresh';

const AdminAuthContext = createContext(undefined);

const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const LAST_ACTIVE_KEY = 'admin_last_active';

export const AdminAuthProvider = ({ children }) => {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const updateLastActive = useCallback(() => {
    if (currentUser) {
      localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
    }
  }, [currentUser]);

  const isSessionValid = useCallback(() => {
    if (!currentUser) return false;
    const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
    if (!lastActive) return false;
    
    if (Date.now() - parseInt(lastActive, 10) > TIMEOUT_MS) {
      return false;
    }
    return true;
  }, [currentUser]);

  const logout = useCallback(async (isAutoLogout = false) => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      clearTokens();
      localStorage.removeItem(LAST_ACTIVE_KEY);
      if (isAutoLogout) {
        toast({
          title: "Session Expired",
          description: "You have been logged out due to inactivity.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error(`[Auth Error] ${new Date().toISOString()}: Admin logout error`, err);
      setCurrentUser(null);
      clearTokens();
    }
  }, [toast]);

  // Session check interval
  useEffect(() => {
    let interval;
    if (currentUser) {
      interval = setInterval(() => {
        if (!isSessionValid()) {
          logout(true);
        }
      }, 60000); // Check every minute
    }
    return () => clearInterval(interval);
  }, [currentUser, isSessionValid, logout]);

  // Activity listeners
  useEffect(() => {
    if (!currentUser) return;
    
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => updateLastActive();
    
    events.forEach(e => window.addEventListener(e, handleActivity));
    return () => events.forEach(e => window.removeEventListener(e, handleActivity));
  }, [currentUser, updateLastActive]);

  useEffect(() => {
    let mounted = true;
    const initSession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (mounted && session?.user) {
          setCurrentUser(session.user);
          saveTokens(session.access_token, session.refresh_token, session.expires_at);
          setupTokenRefreshInterval(session.expires_at);
          localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
        }
      } catch (err) {
        console.error(`[Auth Error] ${new Date().toISOString()}: Admin auth init error`, err);
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setCurrentUser(session?.user ?? null);
        if (session) {
          saveTokens(session.access_token, session.refresh_token, session.expires_at);
          setupTokenRefreshInterval(session.expires_at);
          localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        clearTokens();
        localStorage.removeItem(LAST_ACTIVE_KEY);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      
      setCurrentUser(data.user);
      if (data.session) {
        saveTokens(data.session.access_token, data.session.refresh_token, data.session.expires_at);
        setupTokenRefreshInterval(data.session.expires_at);
      }
      localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
      return data;
    } catch (err) {
      console.error(`[Auth Error] ${new Date().toISOString()}: Admin login failed`, err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(() => ({
    currentUser,
    loading,
    error,
    login,
    logout,
    isSessionValid
  }), [currentUser, loading, error, login, logout, isSessionValid]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};