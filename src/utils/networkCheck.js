import { useState, useEffect } from 'react';

/**
 * Hook to track network online/offline status
 * 
 * @param {Function} onRestore - Optional callback to trigger when connection is restored
 * @returns {Object} - { isOnline } boolean state
 */
export const useNetworkStatus = (onRestore) => {
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? window.navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (onRestore) {
        onRestore();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onRestore]);

  return { isOnline };
};