export const clearBrowserCache = () => {
  if ('caches' in window) {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
  }
};

export const clearLocalStorage = () => {
  localStorage.clear();
};

export const clearSessionStorage = () => {
  sessionStorage.clear();
};

export const invalidateImageCache = () => {
  // A helper to force reload images by appending a timestamp
  forceCacheRefresh();
};

export const forceCacheRefresh = () => {
  window.location.reload(true);
};

export const addCacheBuster = (url) => {
  if (!url) return url;
  try {
    const parsedUrl = new URL(url);
    parsedUrl.searchParams.set('t', new Date().getTime());
    return parsedUrl.toString();
  } catch (e) {
    // If it's a relative URL or invalid
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${new Date().getTime()}`;
  }
};

export const clearSectionCache = (section) => {
  // Clear specific cache keys if using a custom caching layer
  console.log(`Clearing cache for section: ${section}`);
  // Implementation depends on specific app cache strategy (e.g., react-query, swr, custom)
  // For basic fetch, we just rely on cache busters.
};