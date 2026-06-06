import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useConsent } from '@/contexts/ConsentContext';

export const useGoogleAnalytics = (measurementId = 'G-XXXXXXXXXX') => {
  const location = useLocation();
  const { consent } = useConsent();

  const isAnalyticsEnabled = consent.analytics;

  // Initialize GA
  useEffect(() => {
    if (!measurementId || !measurementId.startsWith('G-')) {
      return; // Skip GA initialization if no valid ID provided
    }
    if (!isAnalyticsEnabled || measurementId === 'G-XXXXXXXXXX') return;

    if (!window.gtag) {
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script.async = true;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', measurementId, {
        send_page_view: false, // We'll handle this manually
      });
    }
  }, [isAnalyticsEnabled, measurementId]);

  // Track page views
  useEffect(() => {
    if (isAnalyticsEnabled && window.gtag && measurementId !== 'G-XXXXXXXXXX') {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [location, isAnalyticsEnabled, measurementId]);

  // Expose manual track event
  const trackEvent = useCallback((eventName, eventData = {}) => {
    if (isAnalyticsEnabled && window.gtag) {
      window.gtag('event', eventName, eventData);
    }
  }, [isAnalyticsEnabled]);

  return { trackEvent };
};