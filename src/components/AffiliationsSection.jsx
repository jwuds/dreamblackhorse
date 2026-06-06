import React from 'react';
import AffiliatesMarquee from './AffiliatesMarquee';

const AffiliationsSection = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-[#1a1a1a] via-[#111111] to-[#1a1a1a] border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-[0.2em] mb-8">
          Trusted Affiliates & Industry Connections
        </p>
        <AffiliatesMarquee />
      </div>
    </section>
  );
};

export default AffiliationsSection;