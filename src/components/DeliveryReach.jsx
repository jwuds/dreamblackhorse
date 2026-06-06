import React from 'react';
import { motion } from 'framer-motion';
import { Map, Shield, Calendar, Loader2 } from 'lucide-react';
import { useDeliveryMapImage } from '@/hooks/useDeliveryMapImage';
import ErrorBoundary from '@/components/ErrorBoundary';

const DeliveryReachInner = ({ image: imageProp, loading: loadingProp, error: errorProp }) => {
  const hookData = useDeliveryMapImage();
  
  const image = imageProp !== undefined ? imageProp : hookData.image;
  const loading = loadingProp !== undefined ? loadingProp : hookData.loading;
  const error = errorProp !== undefined ? errorProp : hookData.error;

  const features = [{
    icon: Map,
    title: 'Nationwide Coverage',
    description: 'From coast to coast, we coordinate professional transport to any state or province.'
  }, {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Our transport partners use air-ride suspension trailers with video monitoring.'
  }, {
    icon: Calendar,
    title: 'Flexible Scheduling',
    description: 'Weekly routes available to major equestrian hubs across North America.'
  }];

  return (
    <section className="py-16 md:py-32 px-6 lg:px-8 bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white leading-tight">
              {image?.image_title || 'Map Delivery Reach — Successful Logistics'}
            </h2>
            <div className="w-20 h-1 bg-[#d4af37] mb-8" />
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              We pride ourselves to be a major player in the Friesian industry, importing directly from <strong>Friesland</strong>. Whether you're looking for a <strong>Friesian stallion</strong>, <strong>Friesian mare</strong>, or <strong>Friesian foal</strong>, our long-lasting experience and trusted equine connections created over the years guarantee us a global network. Distance is never an obstacle to finding your dream horse.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
            <div className="relative rounded-xl overflow-hidden shadow-2xl luxury-border aspect-[4/3] bg-[#1a1a1a]">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
                </div>
              ) : error ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[#111]">
                  <p className="text-gray-500">Failed to load map image.</p>
                </div>
              ) : image ? (
                <img 
                  src={image.image_url} 
                  alt={image.image_alt || "Delivery Map / Horse Transport Image"} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 block" 
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111] p-6 text-center border border-white/5 border-dashed">
                  <Map className="w-12 h-12 text-gray-600 mb-4" />
                  <p className="text-gray-400 font-medium text-lg">Delivery map image unavailable</p>
                  <p className="text-gray-500 text-sm mt-2">Please check back later or update via admin dashboard.</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.2 }} className="group bg-[#111] rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 border border-white/5 hover:border-white/20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#d4af37]/10 mb-6 group-hover:bg-[#d4af37]/20 transition-colors duration-300 border border-[#d4af37]/20">
                <feature.icon className="w-8 h-8 text-[#d4af37] group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-2xl font-['Playfair_Display'] font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DeliveryReach = (props) => (
  <ErrorBoundary>
    <DeliveryReachInner {...props} />
  </ErrorBoundary>
);

export default DeliveryReach;