import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Shield, FileText, Scale, Heart, Truck, AlertTriangle, Globe, Lock, Gavel } from 'lucide-react';
import { motion } from 'framer-motion';

const TermsAndPoliciesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: 'general',
      icon: FileText,
      title: '1. General Terms',
      content: (
        <div className="space-y-4 text-gray-300 font-light leading-relaxed">
          <p>
            Welcome to Dream Black Horse Farm. By accessing our website, visiting our facility, or engaging in business with us, you agree to be bound by the following terms and conditions. These terms govern all interactions, purchases, and services provided by Dream Black Horse Farm.
          </p>
        </div>
      )
    },
    {
      id: 'florida-law',
      icon: AlertTriangle,
      title: '2. Florida Equine Activity Liability Act',
      content: (
        <div className="space-y-4 text-gray-300 font-light leading-relaxed">
          <p className="font-medium text-[#d4af37]">
            WARNING: UNDER FLORIDA LAW, AN EQUINE ACTIVITY SPONSOR OR EQUINE PROFESSIONAL IS NOT LIABLE FOR AN INJURY TO, OR THE DEATH OF, A PARTICIPANT IN EQUINE ACTIVITIES RESULTING FROM THE INHERENT RISKS OF EQUINE ACTIVITIES.
          </p>
          <p>
            In accordance with Chapter 773 of the Florida Statutes, any individual interacting with horses at our facility or during our organized activities assumes the inherent risks associated with equine activities, including but not limited to the propensity of equines to behave in ways that may result in injury, harm, or death.
          </p>
        </div>
      )
    },
    {
      id: 'purchase',
      icon: Scale,
      title: '3. Purchase & Sale Agreements',
      content: (
        <div className="space-y-4 text-gray-300 font-light leading-relaxed">
          <p>
            All horse sales are final upon execution of the formal Bill of Sale and clearance of funds. A non-refundable deposit may be required to place a hold on a horse. The specific terms of payment, transfer of ownership, and delivery will be strictly outlined in the individual contract of sale.
          </p>
        </div>
      )
    },
    {
      id: 'health',
      icon: Heart,
      title: '4. Health Guarantees & PPE',
      content: (
        <div className="space-y-4 text-gray-300 font-light leading-relaxed">
          <p>
            We highly encourage all prospective buyers to arrange and finance a Pre-Purchase Examination (PPE) by an independent licensed veterinarian prior to finalizing a purchase. While we disclose all known medical history and represent our horses honestly, horses are sold "as is" and "with all faults" unless a specific, written health guarantee is provided in the Bill of Sale.
          </p>
        </div>
      )
    },
    {
      id: 'transport',
      icon: Truck,
      title: '5. Transport & Boarding',
      content: (
        <div className="space-y-4 text-gray-300 font-light leading-relaxed">
          <p>
            Once a horse is purchased, the buyer assumes all responsibility for board and care, even if the horse remains temporarily at our facility pending transport. We can assist in coordinating with professional equine transporters, but Dream Black Horse Farm is not liable for any injuries, illness, or delays that occur during transit.
          </p>
        </div>
      )
    },
    {
      id: 'liability',
      icon: Shield,
      title: '6. Liability & Insurance',
      content: (
        <div className="space-y-4 text-gray-300 font-light leading-relaxed">
          <p>
            Buyers are strongly advised to secure equine mortality and major medical insurance immediately upon execution of the purchase contract. Dream Black Horse Farm is not liable for any loss, illness, or injury to the horse once the risk of loss has transferred to the buyer as defined by the Bill of Sale.
          </p>
        </div>
      )
    },
    {
      id: 'website',
      icon: Globe,
      title: '7. Website Terms of Use',
      content: (
        <div className="space-y-4 text-gray-300 font-light leading-relaxed">
          <p>
            The content, images, and videos on this website are the exclusive intellectual property of Dream Black Horse Farm. Unauthorized reproduction, distribution, or commercial use of our digital assets without written permission is strictly prohibited. Prices and availability of horses listed online are subject to change without prior notice.
          </p>
        </div>
      )
    },
    {
      id: 'privacy',
      icon: Lock,
      title: '8. Privacy Policy',
      content: (
        <div className="space-y-4 text-gray-300 font-light leading-relaxed">
          <p>
            We respect your privacy and are committed to protecting your personal data. Any information collected through inquiries, newsletters, or sales processes is used solely to facilitate business with Dream Black Horse Farm. We do not sell or distribute your personal information to unauthorized third parties.
          </p>
        </div>
      )
    },
    {
      id: 'governing-law',
      icon: Gavel,
      title: '9. Governing Law',
      content: (
        <div className="space-y-4 text-gray-300 font-light leading-relaxed">
          <p>
            These Terms and Policies, as well as any disputes arising from interactions or sales with Dream Black Horse Farm, shall be governed by and construed in accordance with the laws of the State of Florida. Any legal actions must be filed in the appropriate courts located within Florida.
          </p>
        </div>
      )
    }
  ];

  return (
    <>
      <Helmet>
        <title>Terms & Policies - Dream Black Horse Farm</title>
        <meta name="description" content="Review the Terms, Conditions, and Florida Equine Activity Liability policies for Dream Black Horse Farm." />
      </Helmet>

      <div className="bg-[#111111] min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-['Playfair_Display'] font-bold text-white mb-6">
              Terms & <span className="text-[#d4af37]">Policies</span>
            </h1>
            <div className="w-24 h-1 bg-[#d4af37]/50 mx-auto mb-8" />
            <p className="text-lg text-gray-400 font-light max-w-3xl mx-auto">
              Please carefully review our operational policies, terms of service, and Florida-specific equine liability disclosures before engaging in any transactions.
            </p>
          </motion.div>

          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-[#1a1a1a] rounded-2xl p-8 md:p-10 border border-white/5 hover:border-[#d4af37]/30 transition-colors shadow-lg"
              >
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center border border-[#d4af37]/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                    <section.icon className="w-6 h-6 text-[#d4af37]" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold text-white">
                    {section.title}
                  </h2>
                </div>
                <div className="pl-0 md:pl-19 border-t border-white/5 pt-6">
                  {section.content}
                </div>
              </motion.section>
            ))}
          </div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 bg-black rounded-2xl p-8 md:p-12 border border-[#d4af37]/20 shadow-[0_0_30px_rgba(212,175,55,0.05)] text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-bold text-white mb-4">
                Questions or Concerns?
              </h2>
              <p className="text-gray-400 font-light mb-0 max-w-xl mx-auto">
                If you have any questions regarding these terms, our liability policies, or a specific sales agreement, please contact our administrative office prior to finalizing your purchase.
              </p>
            </div>
          </motion.section>
        </div>
      </div>
    </>
  );
};

export default TermsAndPoliciesPage;