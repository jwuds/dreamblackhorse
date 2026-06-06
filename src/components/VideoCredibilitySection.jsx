import React from 'react';
import { motion } from 'framer-motion';
import VideoCarousel from './VideoCarousel';

const VideoCredibilitySection = () => {
  return (
    <section className="py-24 bg-[#1a1a1a] border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 px-4 sm:px-6 lg:px-8"
        >
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-[0.2em] mb-4">
            Witness the Magic
          </p>
          <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] font-bold text-white mb-6">
            Experience Arrivals at Dream Black Horse Farm
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            See the joy and elegance of our premium Friesians arriving at their new homes. 
            A testament to our dedication to safe transport and exceptional care.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <VideoCarousel />
        </motion.div>
      </div>
    </section>
  );
};

export default VideoCredibilitySection;