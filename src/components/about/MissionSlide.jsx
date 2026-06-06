import React from 'react';
import { Loader2 } from 'lucide-react';

const MissionSlide = ({ statement, image, loading }) => {
  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-[#111] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
      <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
        <h3 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-[#d4af37] mb-6">Our Mission</h3>
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light">
          {statement || "To carefully breed, raise, and deliver premium Friesian horses to passionate equestrians globally, upholding the highest standards of health, temperament, and authentic lineage."}
        </p>
      </div>
      <div className="w-full md:w-5/12 h-64 md:h-auto relative bg-[#0a0a0a]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
          </div>
        ) : (
          <img 
            src={image?.file_path || "https://images.unsplash.com/photo-1598974357801-cbca100e65d3"} 
            alt={image?.alt_text || "Mission statement illustration"} 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-transparent to-transparent hidden md:block" />
      </div>
    </div>
  );
};

export default MissionSlide;