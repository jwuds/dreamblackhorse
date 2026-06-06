import { supabase } from '@/lib/customSupabaseClient';
import { getRefreshToken, saveTokens } from './tokenStorage';
import { clearAuthState } from './authUtils';
import { logRefreshTokenError, logInfo, logAuthError } from './errorLogger';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const handleTokenRefreshError = async (error) => {
  logRefreshTokenError(error, { action: 'handleTokenRefreshError' });
  await clearAuthState();
  
  if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
    window.dispatchEvent(new CustomEvent('auth-refresh-failed'));
  }
};

export const validateRefreshTokenState = () => {
  const refreshToken = getRefreshToken();
  return !!refreshToken;
};

export const refreshAccessToken = async (attempt = 1) => {
  try {
    if (!validateRefreshTokenState()) {
      throw new Error('Refresh Token Not Found');
    }

    logInfo(`Attempting to refresh token (Attempt ${attempt})`, { attempt });
    
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      if (error.message.includes('Refresh Token Not Found') || error.message.includes('Invalid Refresh Token')) {
        throw error; // Fail immediately on invalid token
      }
      throw error;
    }
    
    if (data?.session) {
      saveTokens(
        data.session.access_token,
        data.session.refresh_token,
        data.session.expires_at
      );
      logInfo('Token refresh successful');
      return data.session;
    }
    
    throw new Error('Refresh succeeded but no session data returned');
  } catch (error) {
    // If it's a structural error (not found/invalid), don't retry, just fail
    if (error.message.includes('Refresh Token Not Found') || error.message.includes('Invalid Refresh Token')) {
      await handleTokenRefreshError(error);
      throw error;
    }

    if (attempt < MAX_RETRIES) {
      logAuthError(`Refresh failed, retrying in ${RETRY_DELAY_MS}ms...`, error, { attempt });
      await delay(RETRY_DELAY_MS * attempt); 
      return refreshAccessToken(attempt + 1);
    }
    await handleTokenRefreshError(error);
    throw error;
  }
};

let refreshIntervalId = null;

export const setupTokenRefreshInterval = (expiresAt) => {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId);
  }
  
  if (!expiresAt) return;
  
  const currentTime = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = expiresAt - currentTime;
  const refreshTime = (timeUntilExpiry - 300) * 1000; 
  
  if (refreshTime > 0) {
    refreshIntervalId = setInterval(async () => {
      try {
        await refreshAccessToken();
      } catch (error) {
        logRefreshTokenError(error, { context: 'interval_refresh' });
      }
    }, refreshTime);
  }
};