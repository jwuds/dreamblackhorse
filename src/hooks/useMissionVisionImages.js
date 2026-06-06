import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const useMissionVisionImages = () => {
  const [images, setImages] = useState({ mission: null, vision: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('site_images')
        .select('*')
        .in('section', ['about_mission_image', 'about_vision_image'])
        .eq('status', 'published');

      if (fetchError) throw fetchError;

      const mission = data.find(img => img.section === 'about_mission_image');
      const vision = data.find(img => img.section === 'about_vision_image');
      
      setImages({ mission, vision });
    } catch (err) {
      console.error('Error fetching mission/vision images:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const updateImage = async (id, updates) => {
    const { error } = await supabase.from('site_images').update(updates).eq('id', id);
    if (error) throw error;
    await fetchImages();
  };

  const publishImage = async (id) => {
    await updateImage(id, { status: 'published', published_at: new Date().toISOString() });
  };

  const deleteImage = async (id) => {
    const { error } = await supabase.from('site_images').delete().eq('id', id);
    if (error) throw error;
    await fetchImages();
  };

  return { images, loading, error, fetchImages, updateImage, publishImage, deleteImage };
};