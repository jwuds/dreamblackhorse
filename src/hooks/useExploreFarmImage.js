import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const useExploreFarmImage = () => {
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
        .eq('section', 'explore_farm')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
      
      if (data) {
        setImage(data);
      } else {
        setImage({
          file_path: 'https://images.unsplash.com/photo-1677612128153-d251048b7a1f',
          alt_text: 'Explore Farm Fallback',
          isFallback: true
        });
      }
    } catch (err) {
      console.error('Error fetching explore farm image:', err);
      setError(err.message);
      setImage({
        file_path: 'https://images.unsplash.com/photo-1677612128153-d251048b7a1f',
        alt_text: 'Explore Farm Fallback',
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
      await supabase
        .from('site_images')
        .update({ status: 'draft', published_at: null })
        .eq('section', 'explore_farm')
        .eq('status', 'published');

      const { data, error: updateError } = await supabase
        .from('site_images')
        .update({ 
          section: 'explore_farm', 
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