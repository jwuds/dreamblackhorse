import { logAuthError, logInfo } from './errorLogger';

export const TOKEN_KEYS = {
  ACCESS: 'dream_horse_access_token',
  REFRESH: 'dream_horse_refresh_token',
  EXPIRES_AT: 'dream_horse_expires_at'
};

export const saveTokens = (accessToken, refreshToken, expiresAt) => {
  try {
    if (!accessToken || !refreshToken) {
      throw new Error('Invalid tokens provided for storage');
    }
    localStorage.setItem(TOKEN_KEYS.ACCESS, accessToken);
    localStorage.setItem(TOKEN_KEYS.REFRESH, refreshToken);
    if (expiresAt) {
      localStorage.setItem(TOKEN_KEYS.EXPIRES_AT, expiresAt.toString());
    }
    logInfo('Tokens saved successfully', { action: 'saveTokens' });
  } catch (error) {
    logAuthError('Failed to save tokens', error);
  }
};

export const getTokens = () => {
  try {
    const accessToken = localStorage.getItem(TOKEN_KEYS.ACCESS);
    const refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH);
    const expiresAt = localStorage.getItem(TOKEN_KEYS.EXPIRES_AT);
    
    if (!accessToken || !refreshToken) {
      return null;
    }
    
    return { accessToken, refreshToken, expiresAt: expiresAt ? parseInt(expiresAt, 10) : null };
  } catch (error) {
    logAuthError('Failed to retrieve tokens', error);
    return null;
  }
};

export const clearTokens = () => {
  try {
    localStorage.removeItem(TOKEN_KEYS.ACCESS);
    localStorage.removeItem(TOKEN_KEYS.REFRESH);
    localStorage.removeItem(TOKEN_KEYS.EXPIRES_AT);
    logInfo('Tokens cleared successfully', { action: 'clearTokens' });
  } catch (error) {
    logAuthError('Failed to clear tokens', error);
  }
};

export const validateToken = (token) => {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  return parts.length === 3; 
};

export const isTokenExpired = (expiresAt) => {
  if (!expiresAt) return true;
  const bufferTime = 60; 
  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime >= (expiresAt - bufferTime);
};

export const getAccessToken = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEYS.ACCESS);
    const expiresAt = localStorage.getItem(TOKEN_KEYS.EXPIRES_AT);
    
    if (validateToken(token)) {
      if (expiresAt && !isTokenExpired(parseInt(expiresAt, 10))) {
        return token;
      }
    }
    return null;
  } catch (error) {
    logAuthError('Failed to get access token', error);
    return null;
  }
};

export const getRefreshToken = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEYS.REFRESH);
    return token || null; 
  } catch (error) {
    logAuthError('Failed to get refresh token', error);
    return null;
  }
};