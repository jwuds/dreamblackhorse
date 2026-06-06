import React from 'react';
import { motion } from 'framer-motion';
import ProductsList from '@/components/ProductsList';
import SEOHead from '@/components/SEOHead';

const Shop = () => {
  return (
    <>
      <SEOHead 
        title="Our Premium Horse Collection - Dream Black Horse"
        description="Browse our collection of premium horses for sale. Find Arabian, Thoroughbred, and other quality horses with detailed information and pricing."
        canonical="/shop"
      />

      <div className="bg-[#0f0f0f] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-16 text-center">
            <h1 className="text-5xl md:text-6xl font-['Playfair_Display'] font-bold text-white mb-6">
              Our Premium Horse Collection - Dream Black Horse
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Explore our meticulously curated selection of exceptional horses, raised and trained with unwavering dedication.
            </p>
          </motion.div>

          <ProductsList />
        </div>
      </div>
    </>
  );
};
export default Shop;