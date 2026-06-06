import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';

const HeroCarousel = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const { data, error } = await supabase
          .from('hero_images')
          .select('*')
          .eq('status', 'active')
          .order('order', { ascending: true });

        if (error) throw error;
        setImages(data || []);
      } catch (err) {
        console.error("Error fetching hero images:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroImages();
  }, []);

  const goToNext = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [images.length, goToNext]);

  if (loading) {
    return (
      <div className="w-full h-[60vh] md:h-[85vh] bg-[#0f0f0f] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#d4af37] animate-spin" />
      </div>
    );
  }

  // Fallback if no images found
  if (images.length === 0) {
    return (
      <div className="relative w-full h-[60vh] md:h-[85vh] bg-[#0f0f0f] border-b border-white/10">
        <img 
          src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a" 
          alt="Default Hero" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-black/40 to-transparent flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <h2 className="text-5xl md:text-7xl font-['Playfair_Display'] font-bold text-white mb-6">
              Premium Equestrian Experience
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl">Discover unparalleled excellence in horse breeding and sales.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[60vh] md:h-[85vh] overflow-hidden bg-[#0f0f0f] group">
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex].image_url}
          alt={images[currentIndex].alt_text || `Hero image ${currentIndex + 1}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-black/30 to-transparent pointer-events-none" />

      {/* Navigation Controls */}
      {images.length > 1 && (
        <>
          <Button 
            onClick={goToPrev}
            variant="ghost" 
            size="icon" 
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full h-12 w-12 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronLeft size={24} />
          </Button>
          <Button 
            onClick={goToNext}
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full h-12 w-12 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <ChevronRight size={24} />
          </Button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-[#d4af37] scale-125' : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroCarousel;