import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MissionSlide from './MissionSlide';
import VisionSlide from './VisionSlide';
import { useMissionVisionImages } from '@/hooks/useMissionVisionImages';

const MissionVisionSlider = ({ missionStatement, visionStatement }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { images, loading } = useMissionVisionImages();
  
  const slides = [
    { type: 'mission', component: MissionSlide, image: images.mission, statement: missionStatement },
    { type: 'vision', component: VisionSlide, image: images.vision, statement: visionStatement }
  ];

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(timer);
  }, [handleNext]);

  const CurrentSlideComponent = slides[currentIndex].component;

  return (
    <div className="relative w-full max-w-4xl ml-auto rounded-3xl overflow-hidden group">
      <div className="relative h-[500px] md:h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 h-full w-full"
          >
            <CurrentSlideComponent 
              statement={slides[currentIndex].statement} 
              image={slides[currentIndex].image} 
              loading={loading} 
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#d4af37] hover:text-black border border-white/10"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#d4af37] hover:text-black border border-white/10"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-[#d4af37] w-6' : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MissionVisionSlider;