import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { getTokens, isTokenExpired, clearTokens } from '@/utils/tokenStorage';
import { refreshAccessToken } from '@/utils/tokenRefresh';

export const useSessionRestoration = () => {
  const [isRestoring, setIsRestoring] = useState(true);
  const [restorationError, setRestorationError] = useState(null);

  const restoreSession = useCallback(async () => {
    setIsRestoring(true);
    setRestorationError(null);
    try {
      console.log(`[Auth Info] ${new Date().toISOString()}: Starting session restoration...`);
      
      const tokens = getTokens();
      
      // If we have tokens, let's verify if they are expired
      if (tokens) {
        if (isTokenExpired(tokens.expiresAt)) {
          console.log(`[Auth Info] ${new Date().toISOString()}: Token expired, refreshing...`);
          await refreshAccessToken();
        }
      }

      // Sync with Supabase client state
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;

      if (!data.session && tokens) {
        // We have local tokens but Supabase says no session, try setting it
        console.log(`[Auth Info] ${new Date().toISOString()}: Restoring Supabase session from local tokens`);
        const { error: setSessionError } = await supabase.auth.setSession({
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken
        });
        
        if (setSessionError) {
          clearTokens();
          throw setSessionError;
        }
      }

      console.log(`[Auth Info] ${new Date().toISOString()}: Session restoration complete.`);
    } catch (error) {
      console.error(`[Auth Error] ${new Date().toISOString()}: Session restoration failed`, error);
      setRestorationError(error.message);
      clearTokens();
    } finally {
      setIsRestoring(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return { isRestoring, restorationError, retryRestoration: restoreSession };
};