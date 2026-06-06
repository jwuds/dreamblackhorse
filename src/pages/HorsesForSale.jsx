import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { getProducts } from '@/api/EcommerceApi';
import { Loader2 } from 'lucide-react';
import HorseCardLarge from '@/components/HorseCardLarge';

const HorsesForSale = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [horses, setHorses] = useState([]);

  useEffect(() => {
    const fetchHorses = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        const products = response.products || [];
        setHorses(products);
      } catch (err) {
        setError(err.message || 'Failed to load horses');
      } finally {
        setLoading(false);
      }
    };

    fetchHorses();
  }, []);

  return (
    <>
      <Helmet>
        <title>Horses for Sale - DreamBlackHorse</title>
        <meta name="description" content="Browse our collection of premium horses for sale. Discover exceptional horses from champion bloodlines." />
      </Helmet>

      <div className="bg-[#0f0f0f] min-h-screen">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f]" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-7xl font-['Playfair_Display'] font-bold text-white mb-6">
                Our Collection
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Discover exceptional horses from champion bloodlines. Each horse is carefully selected for its quality, temperament, and potential.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Horses Grid Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-16 w-16 text-white animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center text-red-400 p-8 bg-red-900/20 rounded-2xl border border-red-500/20">
                <p>Error loading horses: {error}</p>
              </div>
            ) : horses.length === 0 ? (
              <div className="text-center text-gray-400 p-12 bg-card rounded-2xl border border-border">
                <p className="text-xl">No horses available at this time.</p>
              </div>
            ) : (
              <div className="horse-grid-responsive">
                {horses.map((horse, index) => (
                  <HorseCardLarge key={horse.id} product={horse} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default HorsesForSale;