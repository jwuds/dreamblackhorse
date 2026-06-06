import React from 'react';
import HorseCard from './HorseCard';

const HorseCategorySection = ({ title, horses }) => {
  return (
    <div className="mb-20">
      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
        <h2 className="text-3xl font-['Playfair_Display'] font-semibold text-white">
          {title}
        </h2>
        <span className="text-gray-400 bg-white/5 px-4 py-1 rounded-full text-sm">
          {horses.length} {horses.length === 1 ? 'Horse' : 'Horses'}
        </span>
      </div>

      {horses.length === 0 ? (
        <div className="text-center py-16 bg-[#1a1a1a] rounded-2xl border border-white/5">
          <p className="text-gray-400 text-lg">No {title.toLowerCase()} currently available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {horses.map((horse, idx) => (
            <HorseCard key={horse.id} product={horse} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HorseCategorySection;