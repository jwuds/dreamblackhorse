import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { getLocalData, setLocalData } from '@/lib/localStorageUtils';
import VideoCarouselEditor from './admin/VideoCarouselEditor';

const STORAGE_KEY = 'dream_horse_videos';
const defaultVideos = [
  { id: '1', title: 'Arrival of Royal Friesian', url: '#', thumbnail: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80', display_order: 0 },
  { id: '2', title: 'First Steps at the Farm', url: '#', thumbnail: 'https://images.unsplash.com/photo-1598974357801-cbca100e65d3?w=800&q=80', display_order: 1 },
  { id: '3', title: 'Champion Bloodline Introduction', url: '#', thumbnail: 'https://images.unsplash.com/photo-1544558452-676b7762deaf?w=800&q=80', display_order: 2 },
];

const VideoCarousel = () => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = () => {
    const data = getLocalData(STORAGE_KEY, null);
    if (!data) {
      setLocalData(STORAGE_KEY, defaultVideos);
      setVideos(defaultVideos);
    } else {
      setVideos(data.sort((a, b) => a.display_order - b.display_order));
    }
  };

  const nextSlide = useCallback(() => {
    if (videos.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  }, [videos.length]);

  const prevSlide = useCallback(() => {
    if (videos.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  }, [videos.length]);

  useEffect(() => {
    if (isHovered || isEditorOpen || videos.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isHovered, nextSlide, isEditorOpen, videos.length]);

  const handlePlayVideo = () => {
    toast({ title: "Video Player", description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" });
  };

  const getVisibleVideos = () => {
    if (videos.length === 0) return [];
    const visible = [];
    for (let i = 0; i < Math.min(3, videos.length); i++) {
      const index = (currentIndex + i) % videos.length;
      visible.push(videos[index]);
    }
    while (visible.length < 3 && visible.length > 0) {
      visible.push(visible[0]);
    }
    return visible;
  };

  return (
    <>
      <div 
        className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {user && (
          <div className="absolute top-4 right-8 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button onClick={() => setIsEditorOpen(true)} className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white">
              <Edit2 className="w-4 h-4 mr-2" /> Manage Videos
            </Button>
          </div>
        )}

        <div className="relative overflow-hidden py-8">
          <div className="flex gap-6 justify-center items-center">
            <AnimatePresence mode="popLayout">
              {getVisibleVideos().map((video, idx) => (
                <motion.div
                  key={`${video.id}-${idx}-${currentIndex}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: idx === 1 ? 1 : 0.5, 
                    scale: idx === 1 ? 1 : 0.9,
                    zIndex: idx === 1 ? 10 : 0
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                  className={`relative flex-shrink-0 cursor-pointer w-full md:w-[45%] lg:w-[30%] ${idx !== 1 ? 'hidden md:block' : 'block'}`}
                  onClick={handlePlayVideo}
                >
                  <div className="group/video relative rounded-2xl overflow-hidden shadow-2xl luxury-border aspect-video bg-[#2a2a2a] hover:-translate-y-2 transition-transform duration-300">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover/video:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-black/40 group-hover/video:bg-black/20 transition-colors duration-300" />
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover/video:bg-white/40 group-hover/video:scale-110 transition-all duration-300 border border-white/30">
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                      <h3 className="text-white font-['Playfair_Display'] text-xl font-semibold">{video.title}</h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Button variant="outline" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 border-white/20 text-white hover:bg-white hover:text-black z-20 hidden md:flex" onClick={prevSlide}>
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button variant="outline" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 border-white/20 text-white hover:bg-white hover:text-black z-20 hidden md:flex" onClick={nextSlide}>
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <VideoCarouselEditor 
        isOpen={isEditorOpen} 
        onClose={() => setIsEditorOpen(false)} 
        videos={videos} 
        onUpdate={(newVids) => {
          setVideos(newVids);
          setLocalData(STORAGE_KEY, newVids);
        }} 
      />
    </>
  );
};

export default VideoCarousel;