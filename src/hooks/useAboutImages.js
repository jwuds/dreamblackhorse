import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { getAboutSectionImage, getImageFallback } from '@/utils/aboutImageIntegration';

export const useAboutImages = () => {
  const [images, setImages] = useState({
    about_story: null,
    about_mission: null,
    about_vision: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [story, mission, vision] = await Promise.all([
        getAboutSectionImage('about_story'),
        getAboutSectionImage('about_mission'),
        getAboutSectionImage('about_vision')
      ]);

      setImages({
        about_story: story || getImageFallback('about_story'),
        about_mission: mission || getImageFallback('about_mission'),
        about_vision: vision || getImageFallback('about_vision')
      });
    } catch (err) {
      console.error('Error fetching about images:', err);
      setError(err.message);
      // Set fallbacks on error
      setImages({
        about_story: getImageFallback('about_story'),
        about_mission: getImageFallback('about_mission'),
        about_vision: getImageFallback('about_vision')
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const publishImage = async (imageId, section) => {
    try {
      // Unpublish existing images in this section
      await supabase
        .from('site_images')
        .update({ status: 'draft', published_at: null })
        .eq('section', section)
        .eq('status', 'published');

      // Publish the new image
      const { data, error: updateError } = await supabase
        .from('site_images')
        .update({ 
          section: section, 
          status: 'published', 
          published_at: new Date().toISOString() 
        })
        .eq('id', imageId)
        .select()
        .single();

      if (updateError) throw updateError;
      
      setImages(prev => ({
        ...prev,
        [section]: data
      }));
      
      return data;
    } catch (err) {
      console.error(`Error publishing image for ${section}:`, err);
      throw err;
    }
  };

  const updateSectionImage = async (imageId, section) => {
    return publishImage(imageId, section);
  };

  const deleteImage = async (imageId) => {
    try {
      const { error: deleteError } = await supabase
        .from('site_images')
        .delete()
        .eq('id', imageId);

      if (deleteError) throw deleteError;
      await fetchImages(); // Refresh after delete
    } catch (err) {
      console.error('Error deleting image:', err);
      throw err;
    }
  };

  return {
    images,
    loading,
    error,
    fetchImages,
    getStoryImage: () => images.about_story,
    getMissionImage: () => images.about_mission,
    getVisionImage: () => images.about_vision,
    updateStoryImage: (id) => updateSectionImage(id, 'about_story'),
    updateMissionImage: (id) => updateSectionImage(id, 'about_mission'),
    updateVisionImage: (id) => updateSectionImage(id, 'about_vision'),
    publishImage,
    deleteImage
  };
};