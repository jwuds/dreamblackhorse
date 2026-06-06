import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie } from 'lucide-react';
import { motion } from 'framer-motion';
import { useConsent } from '@/contexts/ConsentContext';
import { Button } from '@/components/ui/button';

const CookiesPage = () => {
  const { consent, withdrawConsent } = useConsent();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Cookie Policy - DreamBlackHorse</title>
        <meta name="description" content="Cookie Policy for DreamBlackHorse. Learn how we use cookies and how you can manage your preferences." />
      </Helmet>

      <div className="min-h-screen bg-[#1a1a1a] pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#222] p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Cookie className="w-6 h-6 text-orange-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-white">Cookie Policy</h1>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-xl p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-white font-semibold mb-1">Your Current Preferences</h3>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>Essential Cookies: <span className="text-green-400 font-medium">Active (Required)</span></p>
                  <p>Analytics Cookies: <span className={consent.analytics ? "text-green-400 font-medium" : "text-gray-500 font-medium"}>{consent.analytics ? 'Active' : 'Inactive'}</span></p>
                  <p>Marketing Cookies: <span className={consent.marketing ? "text-green-400 font-medium" : "text-gray-500 font-medium"}>{consent.marketing ? 'Active' : 'Inactive'}</span></p>
                </div>
              </div>
              <Button onClick={withdrawConsent} variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black">
                Manage Preferences
              </Button>
            </div>

            <div className="prose prose-invert max-w-none prose-headings:font-['Playfair_Display'] prose-headings:text-white prose-p:text-gray-300 prose-a:text-blue-400 prose-li:text-gray-300">
              <h2>1. What are cookies?</h2>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
              </p>

              <h2>2. How do we use cookies?</h2>
              <p>We use cookies for the following purposes:</p>
              
              <h3>Essential Cookies</h3>
              <p>
                These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the website, you cannot refuse them without impacting how our site functions.
              </p>

              <h3>Analytics Cookies</h3>
              <p>
                These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are, or to help us customize our website for you in order to enhance your experience. (e.g., Google Analytics).
              </p>

              <h3>Marketing Cookies</h3>
              <p>
                These cookies are used to make advertising messages more relevant to you and your interests. They also perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed, and in some cases selecting advertisements that are based on your interests.
              </p>

              <h2>3. How long do cookies last?</h2>
              <p>
                The length of time that a cookie remains on your computer or mobile device depends on whether it is a "persistent" or "session" cookie. Session cookies last until you stop browsing and persistent cookies last until they expire or are deleted. Most of the cookies we use are persistent and will expire between 30 minutes and two years from the date they are downloaded to your device.
              </p>

              <h2>4. How to control cookies</h2>
              <p>
                You can control and manage cookies in various ways. You can use the "Manage Preferences" button above to update your consent on our site at any time. Additionally, most browsers allow you to view, manage, delete and block cookies for a website. Be aware that if you delete all cookies then any preferences you have set will be lost, including the ability to opt-out from cookies as this function itself requires placement of an opt-out cookie on your device.
              </p>

              <h2>5. More Information</h2>
              <p>
                For more information regarding how we handle your personal data, please review our <Link to="/privacy">Privacy Policy</Link>.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CookiesPage;