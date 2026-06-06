import { useCallback } from 'react';

// In-memory cache store
const cacheStore = new Map();

export const useSupabaseCache = () => {
  const getCachedData = useCallback((key, maxAgeMs) => {
    const item = cacheStore.get(key);
    if (!item) return null;
    
    const isExpired = Date.now() - item.timestamp > maxAgeMs;
    if (isExpired) {
      cacheStore.delete(key);
      return null;
    }
    
    return item.data;
  }, []);

  const setCachedData = useCallback((key, data) => {
    cacheStore.set(key, {
      data,
      timestamp: Date.now()
    });
  }, []);

  const invalidateCache = useCallback((key) => {
    if (key) {
      cacheStore.delete(key);
    } else {
      cacheStore.clear();
    }
  }, []);

  return { getCachedData, setCachedData, invalidateCache };
};