import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const useDeliveryMapImage = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImage = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('home_page_images')
        .select('*')
        .eq('section_name', 'delivery_map')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;
      
      setImage(data && data.length > 0 ? data[0] : null);
    } catch (err) {
      console.error('Error fetching delivery map image:', err);
      setError(err.message);
      setImage(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImage();
  }, [fetchImage]);

  const updateImage = async (id, updates) => {
    const { error } = await supabase.from('home_page_images').update(updates).eq('id', id);
    if (error) throw error;
    await fetchImage();
  };

  return { image, loading, error, fetchImage, updateImage };
};