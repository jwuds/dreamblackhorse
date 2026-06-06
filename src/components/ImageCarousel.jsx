import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, AlertCircle, RefreshCw, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCarouselImages } from '@/hooks/useCarouselImages';

const ImageCarousel = ({ images: propImages = [] }) => {
  const { images: dbImages, loading, error, fetchImages } = useCarouselImages();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayImages, setDisplayImages] = useState([]);
  const [imageErrors, setImageErrors] = useState(new Set());

  // Fetch from DB on mount
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Determine which images to display (DB prioritized over props)
  useEffect(() => {
    let processed = [];
    if (dbImages && dbImages.length > 0) {
      processed = dbImages;
      console.log("ImageCarousel: Using DB images:", processed.map(img => img.image_url));
    } else if (propImages && propImages.length > 0) {
      // Convert string array to object array for consistency
      processed = propImages.map((url, idx) => ({
        id: `prop-${idx}`,
        image_url: url,
        alt_text: `Carousel fallback image ${idx + 1}`,
        order: idx
      }));
      console.log("ImageCarousel: Using fallback prop images:", processed.map(img => img.image_url));
    } else {
      console.warn("ImageCarousel: No images provided via DB or props.");
    }
    
    setDisplayImages(processed);
    setCurrentIndex(0);
  }, [dbImages, propImages]);

  // Auto-advance timer
  useEffect(() => {
    if (!displayImages || displayImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [displayImages]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const handleImageError = (index, url) => {
    console.error(`ImageCarousel: Failed to load image at index ${index}. URL: ${url}`);
    setImageErrors(prev => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
  };

  // Loading State Skeleton
  if (loading && displayImages.length === 0) {
    return (
      <div className="carousel-container rounded-2xl bg-[#111] border border-white/5 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-white/50 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading carousel images...</p>
      </div>
    );
  }

  // Error State
  if (error && displayImages.length === 0) {
    return (
      <div className="carousel-container rounded-2xl bg-[#111] border border-red-500/20 flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Failed to load images</h3>
        <p className="text-gray-400 mb-6 max-w-md">{error}</p>
        <Button onClick={fetchImages} variant="outline" className="border-white/20 hover:bg-white/10">
          <RefreshCw className="w-4 h-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  // Empty State
  if (displayImages.length === 0) {
    return (
      <div className="carousel-container rounded-2xl bg-[#111] border border-white/5 flex flex-col items-center justify-center min-h-[400px]">
        <ImageIcon className="w-16 h-16 text-white/20 mb-4" />
        <p className="text-gray-500 font-medium">No carousel images available</p>
      </div>
    );
  }

  const currentItem = displayImages[currentIndex];
  const hasError = imageErrors.has(currentIndex);

  const fallbackPlaceholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzQ0NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD4KPC9zdmc+";

  return (
    <div className="carousel-container group rounded-2xl bg-[#0a0a0a]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={hasError ? fallbackPlaceholder : currentItem.image_url}
            alt={currentItem.alt_text || `Carousel display image ${currentIndex + 1}`}
            className="carousel-image"
            onError={() => handleImageError(currentIndex, currentItem.image_url)}
            loading={currentIndex === 0 ? "eager" : "lazy"}
          />
        </motion.div>
      </AnimatePresence>

      {displayImages.length > 1 && (
        <>
          <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              className="bg-black/50 text-white hover:bg-black/80 rounded-full h-12 w-12 backdrop-blur-sm border border-white/20 pointer-events-auto"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="bg-black/50 text-white hover:bg-black/80 rounded-full h-12 w-12 backdrop-blur-sm border border-white/20 pointer-events-auto"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          </div>

          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
            {displayImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 shadow-lg ${
                  idx === currentIndex ? 'w-10 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
      
      {/* Overlay gradient to ensure UI controls remain visible on bright images */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default ImageCarousel;