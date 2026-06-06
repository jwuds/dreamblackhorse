import { supabase } from '@/lib/customSupabaseClient';
import { clearTokens } from './tokenStorage';
import { logInfo, logAuthError } from './errorLogger';

export const clearAuthState = async () => {
  try {
    logInfo('Clearing auth state');
    
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) {
      logAuthError('Error during Supabase sign out', error);
    }
    
    // Clear tokens from localStorage
    clearTokens();
    
    // Clear any other auth-related localStorage items
    const authKeys = Object.keys(localStorage).filter(key => 
      key.includes('supabase') || 
      key.includes('auth') || 
      key.includes('token') ||
      key.includes('dream_horse')
    );
    
    authKeys.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        logAuthError(`Failed to remove ${key} from localStorage`, e);
      }
    });
    
    logInfo('Auth state cleared successfully');
  } catch (error) {
    logAuthError('Critical failure during clearAuthState', error);
    // Force clear tokens even if Supabase signOut fails
    clearTokens();
  }
};

export const validateAuthSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      logAuthError('Session validation failed', error);
      return null;
    }
    
    return session;
  } catch (error) {
    logAuthError('Exception during session validation', error);
    return null;
  }
};

export const checkAuthStatus = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      if (error.message.includes('refresh_token_not_found') || 
          error.message.includes('invalid_token')) {
        await clearAuthState();
        return { authenticated: false, user: null };
      }
      throw error;
    }
    
    return { authenticated: !!user, user };
  } catch (error) {
    logAuthError('Error checking auth status', error);
    return { authenticated: false, user: null };
  }
};