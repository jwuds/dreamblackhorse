import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Shield, FileText, Cookie, Mail, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacyTermsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: 'privacy',
      icon: Shield,
      title: 'Privacy Policy',
      content: (
        <div className="space-y-6 text-gray-300 font-light leading-relaxed">
          <p>
            At Dream Black Horse Farm, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard the data you provide to us when interacting with our website and services.
          </p>
          <h3 className="text-xl font-medium text-white mt-8 mb-4 font-['Playfair_Display']">Information We Collect</h3>
          <p>
            We may collect personal information such as your name, email address, phone number, and mailing address when you submit inquiries, subscribe to our newsletter, or initiate the process of purchasing a horse. We also collect non-personal data such as browser type, IP address, and website usage metrics to improve our digital experience.
          </p>
          <h3 className="text-xl font-medium text-white mt-8 mb-4 font-['Playfair_Display']">How We Use Your Information</h3>
          <p>
            Your information is primarily used to process your inquiries, facilitate horse sales and transport arrangements, communicate updates regarding our breeding program, and provide customer support. We may also use your data to send promotional materials if you have explicitly opted in to receive them.
          </p>
          <h3 className="text-xl font-medium text-white mt-8 mb-4 font-['Playfair_Display']">Data Sharing and Security</h3>
          <p>
            We do not sell, trade, or rent your personal identification information to third parties. We may share necessary information with trusted partners, such as veterinary clinics or equine transport services, solely for the purpose of completing a transaction or service you have requested. We employ industry-standard security measures to protect your data from unauthorized access or disclosure.
          </p>
        </div>
      )
    },
    {
      id: 'terms',
      icon: FileText,
      title: 'Terms of Service',
      content: (
        <div className="space-y-6 text-gray-300 font-light leading-relaxed">
          <p>
            By accessing and using the Dream Black Horse Farm website, you agree to comply with and be bound by the following Terms of Service. Please read these terms carefully before engaging in any transactions or utilizing our services.
          </p>
          <h3 className="text-xl font-medium text-white mt-8 mb-4 font-['Playfair_Display']">Horse Sales and Guarantees</h3>
          <p>
            All horse sales are subject to a formal written contract. While we strive to provide accurate descriptions, photographs, and veterinary records, buyers are strongly encouraged to conduct their own pre-purchase veterinary examinations (PPE). Health guarantees are outlined explicitly within individual sales contracts and are not implied by website descriptions.
          </p>
          <h3 className="text-xl font-medium text-white mt-8 mb-4 font-['Playfair_Display']">Website Content and Intellectual Property</h3>
          <p>
            All content on this website, including but not limited to text, photographs, logos, and videos, is the exclusive property of Dream Black Horse Farm and is protected by copyright laws. You may not reproduce, distribute, or utilize our content for commercial purposes without explicit written permission.
          </p>
          <h3 className="text-xl font-medium text-white mt-8 mb-4 font-['Playfair_Display']">Limitation of Liability</h3>
          <p>
            Equine activities inherently involve risk. Dream Black Horse Farm shall not be held liable for any injuries, damages, or losses incurred during interactions with horses purchased from our facility, except where explicitly stated in a signed legal agreement.
          </p>
        </div>
      )
    },
    {
      id: 'cookies',
      icon: Cookie,
      title: 'Cookie Policy',
      content: (
        <div className="space-y-6 text-gray-300 font-light leading-relaxed">
          <p>
            Our website uses cookies to enhance your browsing experience, analyze site traffic, and serve targeted advertisements. Cookies are small text files stored on your device when you visit our site.
          </p>
          <h3 className="text-xl font-medium text-white mt-8 mb-4 font-['Playfair_Display']">Types of Cookies We Use</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Essential Cookies:</strong> Necessary for the website to function properly, such as maintaining shopping cart state or secure logins.</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website by collecting and reporting information anonymously.</li>
            <li><strong>Marketing Cookies:</strong> Used to track visitors across websites to display relevant and engaging advertisements.</li>
          </ul>
          <p className="mt-4">
            You can manage or disable cookies through your browser settings at any time. However, please note that disabling certain cookies may impact the functionality of our website.
          </p>
        </div>
      )
    }
  ];

  return (
    <>
      <Helmet>
        <title>Privacy Policy & Terms of Service - Dream Black Horse Farm</title>
        <meta name="description" content="Read our Privacy Policy, Terms of Service, and Cookie Policy. Learn how we handle your data and the terms governing horse sales and interactions." />
      </Helmet>

      <div className="bg-[#111111] min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-['Playfair_Display'] font-bold text-white mb-6">
              Legal & Policies
            </h1>
            <div className="w-24 h-1 bg-white/20 mx-auto mb-8" />
            <p className="text-lg text-gray-400 font-light max-w-2xl mx-auto">
              Transparency and trust are fundamental to our breeding program. Please review our policies regarding data privacy, terms of service, and website usage.
            </p>
          </motion.div>

          <div className="space-y-16">
            {sections.map((section, index) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-[#1a1a1a] rounded-3xl p-8 md:p-12 border border-white/5 shadow-xl"
              >
                <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                  <div className="w-12 h-12 rounded-full bg-[#222] flex items-center justify-center border border-white/10">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-['Playfair_Display'] font-bold text-white">
                    {section.title}
                  </h2>
                </div>
                {section.content}
              </motion.section>
            ))}
          </div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 bg-gradient-to-br from-[#222] to-[#111] rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl text-center"
          >
            <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold text-white mb-6">
              Questions About Our Policies?
            </h2>
            <p className="text-gray-400 font-light mb-8 max-w-xl mx-auto">
              If you require further clarification regarding our privacy practices or terms of service, our administrative team is here to assist you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-gray-300">
              <a href="mailto:info@dreamblackhorse.com" className="flex items-center gap-3 hover:text-white transition-colors duration-300 bg-white/5 px-6 py-3 rounded-full border border-white/5 hover:border-white/20">
                <Mail className="w-5 h-5" />
                info@dreamblackhorse.com
              </a>
              <a href="tel:+15551234567" className="flex items-center gap-3 hover:text-white transition-colors duration-300 bg-white/5 px-6 py-3 rounded-full border border-white/5 hover:border-white/20">
                <Phone className="w-5 h-5" />
                +1 (555) 123-4567
              </a>
            </div>
          </motion.section>
        </div>
      </div>
    </>
  );
};

export default PrivacyTermsPage;