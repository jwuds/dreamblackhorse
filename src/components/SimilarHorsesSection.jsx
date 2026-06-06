import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getProducts } from '@/api/EcommerceApi';

const SimilarHorsesSection = ({ currentHorse }) => {
  const [similarHorses, setSimilarHorses] = useState([]);

  useEffect(() => {
    const fetchSimilar = async () => {
      if (!currentHorse) return;
      try {
        const data = await getProducts();
        const allHorses = data.products || [];
        
        const filtered = allHorses
          .filter(h => h.id !== currentHorse.id)
          .slice(0, 4);
          
        setSimilarHorses(filtered);
      } catch (err) {
        // Handle error silently for related section
      }
    };

    fetchSimilar();
  }, [currentHorse]);

  if (!similarHorses || similarHorses.length === 0) return null;

  return (
    <div className="mt-24 pt-16 border-t border-white/10">
      <h2 className="text-3xl font-['Playfair_Display'] font-semibold text-white mb-8">
        Similar Horses
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {similarHorses.map((horse, idx) => (
          <motion.div
            key={horse.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className="group"
          >
            <Link to={`/product/${horse.id}`} className="block">
              <div className="relative overflow-hidden rounded-lg mb-4 bg-[#2a2a2a] aspect-[4/5] luxury-border">
                <img
                  src={horse.image || ''}
                  alt={horse.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-medium text-white truncate font-['Playfair_Display']">{horse.title}</h3>
                <p className="text-white font-semibold">{horse.variants?.[0]?.price_formatted}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SimilarHorsesSection;