import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const getDeliveryMapImage = async () => {
  try {
    const { data, error } = await supabase
      .from('home_page_images')
      .select('*')
      .eq('section_name', 'delivery_map')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error fetching delivery map image:', err);
    return null;
  }
};

export function useHomePageImages(sectionFilter = null) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('home_page_images')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (sectionFilter) {
        query = query.eq('section_name', sectionFilter);
      }

      const { data, error: err } = await query;
      if (err) throw err;
      setImages(data || []);
    } catch (err) {
      console.error('Error fetching home page images:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sectionFilter]);

  useEffect(() => {
    fetchImages();

    const channel = supabase
      .channel('home_page_images_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'home_page_images' }, () => {
        fetchImages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchImages]);

  const addImage = async (imageData) => {
    const { data, error } = await supabase.from('home_page_images').insert([imageData]).select();
    if (error) throw error;
    return data[0];
  };

  const updateImage = async (id, updates) => {
    const { data, error } = await supabase
      .from('home_page_images')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  };

  const deleteImage = async (id) => {
    const { error } = await supabase.from('home_page_images').delete().eq('id', id);
    if (error) throw error;
  };

  const reorderImages = async (reorderedItems) => {
    const updates = reorderedItems.map(item => ({
      id: item.id,
      display_order: item.display_order,
      section_name: item.section_name,
      image_url: item.image_url,
      updated_at: new Date().toISOString()
    }));
    
    for (const item of updates) {
      await updateImage(item.id, { display_order: item.display_order });
    }
    fetchImages();
  };

  return {
    images,
    loading,
    error,
    fetchImages,
    addImage,
    updateImage,
    deleteImage,
    reorderImages
  };
}