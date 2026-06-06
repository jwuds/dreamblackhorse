import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConsent } from '@/contexts/ConsentContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, X } from 'lucide-react';

const CookieConsentBanner = () => {
  const { consent, setConsent, hasUserConsented } = useConsent();
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: consent.analytics,
    marketing: consent.marketing
  });

  useEffect(() => {
    if (!hasUserConsented()) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [hasUserConsented]);

  const handleAcceptAll = () => {
    setConsent({ analytics: true, marketing: true });
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    setConsent({ analytics: false, marketing: false });
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    setConsent(preferences);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 pointer-events-none"
        >
          <div className="max-w-6xl mx-auto bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl p-6 pointer-events-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
            
            {!showCustomize ? (
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-bold text-white">We value your privacy</h3>
                  </div>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                    We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. Read more in our <Link to="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link> and <Link to="/cookies" className="text-blue-400 hover:underline">Cookie Policy</Link>.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 w-full lg:w-auto shrink-0 justify-end">
                  <Button variant="outline" onClick={() => setShowCustomize(true)} className="border-white/20 text-white hover:bg-white/5 flex-1 lg:flex-none">
                    Customize
                  </Button>
                  <Button variant="outline" onClick={handleRejectAll} className="border-white/20 text-white hover:bg-white/5 flex-1 lg:flex-none">
                    Reject All
                  </Button>
                  <Button onClick={handleAcceptAll} className="bg-white text-black hover:bg-gray-200 flex-1 lg:flex-none font-semibold">
                    Accept All
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Cookie Preferences</h3>
                  <button onClick={() => setShowCustomize(false)} className="text-gray-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[#111] rounded-xl border border-white/5">
                    <div>
                      <h4 className="text-white font-medium">Essential Cookies</h4>
                      <p className="text-xs text-gray-400 mt-1">Required for the website to function properly. Cannot be disabled.</p>
                    </div>
                    <div className="text-blue-400 text-sm font-semibold">Always Active</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-[#111] rounded-xl border border-white/5">
                    <div className="pr-4">
                      <h4 className="text-white font-medium">Analytics Cookies</h4>
                      <p className="text-xs text-gray-400 mt-1">Help us understand how visitors interact with our website.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={preferences.analytics} onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))} />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#111] rounded-xl border border-white/5">
                    <div className="pr-4">
                      <h4 className="text-white font-medium">Marketing Cookies</h4>
                      <p className="text-xs text-gray-400 mt-1">Used to deliver tailored advertisements based on your interests.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={preferences.marketing} onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))} />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <Button variant="outline" onClick={() => setShowCustomize(false)} className="border-white/20 text-white">Back</Button>
                  <Button onClick={handleSavePreferences} className="bg-white text-black hover:bg-gray-200 font-semibold">Save Preferences</Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsentBanner;