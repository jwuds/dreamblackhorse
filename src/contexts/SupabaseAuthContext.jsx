import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { saveTokens, getTokens } from '@/utils/tokenStorage';
import { clearAuthState } from '@/utils/authUtils';
import { logAuthError, logInfo, logSessionError } from '@/utils/errorLogger';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSession = useCallback(async (currentSession) => {
    setSession(currentSession);
    setUser(currentSession?.user ?? null);
    if (currentSession) {
      saveTokens(
        currentSession.access_token,
        currentSession.refresh_token,
        currentSession.expires_at
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        logInfo('Initializing auth state...');
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          logSessionError(error, { context: 'initialization' });
          if (error.message.includes('Refresh Token Not Found')) {
            await clearAuthState();
          }
        }
        
        if (mounted) {
          await handleSession(initialSession);
        }
      } catch (err) {
        logAuthError('Critical failure during auth initialization', err);
        if (mounted) {
          await handleSession(null);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        logInfo(`Auth event triggered: ${event}`);
        
        if (event === 'SIGNED_OUT') {
          await clearAuthState();
          if (mounted) {
            setUser(null);
            setSession(null);
          }
        } else if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
          if (mounted) {
            await handleSession(currentSession);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleSession]);

  const signUp = useCallback(async (email, password, options) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password, options });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      logAuthError('Sign up failed', error);
      toast({
        variant: "destructive",
        title: "Sign up Failed",
        description: error.message || "Something went wrong. Please try again.",
      });
      return { error };
    }
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await handleSession(data.session);
      return { error: null };
    } catch (error) {
      logAuthError('Sign in failed', error);
      toast({
        variant: "destructive",
        title: "Sign in Failed",
        description: error.message || "Invalid login credentials.",
      });
      return { error };
    }
  }, [handleSession, toast]);

  const signOut = useCallback(async () => {
    try {
      await clearAuthState();
      setUser(null);
      setSession(null);
      return { error: null };
    } catch (error) {
      logAuthError('Sign out failed', error);
      toast({
        variant: "destructive",
        title: "Sign out Failed",
        description: "An error occurred while signing out. Local session cleared.",
      });
      return { error };
    }
  }, [toast]);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    clearAuthState
  }), [user, session, loading, signUp, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};