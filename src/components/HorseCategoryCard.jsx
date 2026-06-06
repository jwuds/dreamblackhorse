import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HorseCategoryCard = ({ title, description, image, link }) => {
  return (
    <Link to={link} className="group block h-full">
      <div className="relative rounded-3xl overflow-hidden h-full border border-white/10 bg-[#1a1a1a] shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
        <div className="relative w-full overflow-hidden">
          <img 
            src={image} 
            alt={`${title} category`} 
            className="horse-image-container-md transform group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-4xl font-['Playfair_Display'] font-bold text-white">
              {title}
            </h3>
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-black transition-colors duration-300">
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed max-w-md">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default HorseCategoryCard;