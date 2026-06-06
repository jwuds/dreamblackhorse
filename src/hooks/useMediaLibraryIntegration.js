import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const imageCache = new Map();

export const useMediaLibraryIntegration = (section) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImages = useCallback(async (forceRefresh = false) => {
    if (!section) return;
    
    if (!forceRefresh && imageCache.has(section)) {
      setImages(imageCache.get(section));
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('site_images')
        .select('*')
        .eq('section', section)
        .eq('status', 'published')
        .order('published_at', { ascending: false });
        
      if (fetchError) throw fetchError;
      
      const fetchedImages = data || [];
      imageCache.set(section, fetchedImages);
      setImages(fetchedImages);
    } catch (err) {
      console.error(`Error fetching images for ${section}:`, err);
      setError(err.message);
      // Fallback
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [section]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return { images, loading, error, fetchImages };
};