import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const useMapDeliveryReachImage = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImage = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('site_images')
        .select('*')
        .eq('section', 'map_delivery_reach')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
      
      if (data) {
        setImage(data);
      } else {
        setImage({
          file_path: 'https://images.unsplash.com/photo-1578783931049-165bde93e43f',
          alt_text: 'Map Delivery Reach Fallback',
          isFallback: true
        });
      }
    } catch (err) {
      console.error('Error fetching map delivery reach image:', err);
      setError(err.message);
      setImage({
        file_path: 'https://images.unsplash.com/photo-1578783931049-165bde93e43f',
        alt_text: 'Map Delivery Reach Fallback',
        isFallback: true
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImage();
  }, [fetchImage]);

  const publishImage = async (imageId) => {
    try {
      // Unpublish current
      await supabase
        .from('site_images')
        .update({ status: 'draft', published_at: null })
        .eq('section', 'map_delivery_reach')
        .eq('status', 'published');

      // Publish new
      const { data, error: updateError } = await supabase
        .from('site_images')
        .update({ 
          section: 'map_delivery_reach', 
          status: 'published', 
          published_at: new Date().toISOString() 
        })
        .eq('id', imageId)
        .select()
        .single();

      if (updateError) throw updateError;
      setImage(data);
      return data;
    } catch (err) {
      console.error('Error publishing image:', err);
      throw err;
    }
  };

  return { image, loading, error, fetchImage, publishImage };
};