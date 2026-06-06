import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { clearSectionCache } from '@/utils/cacheManager';

export const useMediaManagement = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchImages = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('site_images').select('*').order('created_at', { ascending: false });

      if (filters.section) query = query.eq('section', filters.section);
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.search) {
        query = query.or(`file_name.ilike.%${filters.search}%,alt_text.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setImages(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching images:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const updateImageMetadata = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('site_images')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setImages(prev => prev.map(img => img.id === id ? data : img));
      return data;
    } catch (err) {
      console.error('Error updating metadata:', err);
      throw err;
    }
  };

  const publishImage = async (id, section) => {
    try {
      // Unpublish others in section if replacing (optional logic depending on needs, but here we just publish)
      const { data, error } = await supabase
        .from('site_images')
        .update({ status: 'published', published_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      clearSectionCache(section);
      setImages(prev => prev.map(img => img.id === id ? data : img));
      return data;
    } catch (err) {
      console.error('Error publishing image:', err);
      throw err;
    }
  };

  const unpublishImage = async (id) => {
    try {
      const { data, error } = await supabase
        .from('site_images')
        .update({ status: 'draft', published_at: null })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setImages(prev => prev.map(img => img.id === id ? data : img));
      return data;
    } catch (err) {
      console.error('Error unpublishing image:', err);
      throw err;
    }
  };

  const deleteImage = async (id, fileUrl) => {
    try {
      // Attempt storage delete (might fail if URL structure differs, but try to parse path)
      if (fileUrl) {
        try {
          const path = fileUrl.split('site-images/')[1];
          if (path) {
            await supabase.storage.from('site-images').remove([path]);
          }
        } catch (e) {
          console.error('Storage delete failed, proceeding with DB delete', e);
        }
      }

      const { error } = await supabase.from('site_images').delete().eq('id', id);
      if (error) throw error;
      
      setImages(prev => prev.filter(img => img.id !== id));
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
    updateImageMetadata,
    publishImage,
    unpublishImage,
    deleteImage
  };
};