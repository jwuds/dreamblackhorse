import React, { createContext, useContext, useState, useEffect } from 'react';

const ConsentContext = createContext({});

const defaultConsent = {
  essential: true, // Always true
  analytics: false,
  marketing: false,
  hasAnswered: false,
};

export const ConsentProvider = ({ children }) => {
  const [consent, setConsentState] = useState(defaultConsent);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cookieConsent');
      if (stored) {
        setConsentState(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error reading cookie consent', e);
    }
    setIsInitialized(true);
  }, []);

  const setConsent = (preferences) => {
    const newConsent = { ...defaultConsent, ...preferences, essential: true, hasAnswered: true };
    setConsentState(newConsent);
    localStorage.setItem('cookieConsent', JSON.stringify(newConsent));
  };

  const getConsent = () => consent;

  const hasUserConsented = () => consent.hasAnswered;

  const withdrawConsent = () => {
    const newConsent = { ...defaultConsent, hasAnswered: true };
    setConsentState(newConsent);
    localStorage.setItem('cookieConsent', JSON.stringify(newConsent));
  };

  if (!isInitialized) return null;

  return (
    <ConsentContext.Provider value={{ consent, setConsent, getConsent, hasUserConsented, withdrawConsent }}>
      {children}
    </ConsentContext.Provider>
  );
};

export const useConsent = () => {
  const context = useContext(ConsentContext);
  if (!context) throw new Error('useConsent must be used within a ConsentProvider');
  return context;
};