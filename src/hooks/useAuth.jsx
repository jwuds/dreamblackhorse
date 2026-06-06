import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { saveTokens, clearTokens } from '@/utils/tokenStorage';
import { setupTokenRefreshInterval } from '@/utils/tokenRefresh';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (mounted) {
          if (session) {
            setUser(session.user);
            saveTokens(session.access_token, session.refresh_token, session.expires_at);
            setupTokenRefreshInterval(session.expires_at);
          } else {
            setUser(null);
          }
        }
      } catch (err) {
        console.error(`[Auth Error] ${new Date().toISOString()}: Initialization failed`, err);
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`[Auth Event] ${new Date().toISOString()}: ${event}`);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
        if (session) {
          saveTokens(session.access_token, session.refresh_token, session.expires_at);
          setupTokenRefreshInterval(session.expires_at);
        }
      } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setUser(null);
        clearTokens();
      }
    });

    // Handle global refresh failures
    const handleRefreshFailure = () => {
      setUser(null);
      toast({
        title: "Session Expired",
        description: "Please log in again to continue.",
        variant: "destructive"
      });
    };

    window.addEventListener('auth-refresh-failed', handleRefreshFailure);

    return () => {
      mounted = false;
      subscription?.unsubscribe();
      window.removeEventListener('auth-refresh-failed', handleRefreshFailure);
    };
  }, [toast]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      
      if (signInError) throw signInError;
      
      return data.user;
    } catch (err) {
      console.error(`[Auth Error] ${new Date().toISOString()}: Login failed`, err);
      toast({ title: 'Login Failed', description: err.message, variant: 'destructive' });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      
      clearTokens();
      setUser(null);
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    } catch (err) {
      console.error(`[Auth Error] ${new Date().toISOString()}: Logout failed`, err);
      // Even if server sign-out fails, clear local state
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const signup = useCallback(async (email, password, metadata = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      });
      
      if (signUpError) throw signUpError;
      
      toast({ title: 'Signup Successful', description: 'Please check your email to verify your account.' });
      return data.user;
    } catch (err) {
      console.error(`[Auth Error] ${new Date().toISOString()}: Signup failed`, err);
      toast({ title: 'Signup Failed', description: err.message, variant: 'destructive' });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};