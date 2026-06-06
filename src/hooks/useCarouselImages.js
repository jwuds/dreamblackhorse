import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export const useCarouselImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('useCarouselImages: Fetching carousel images from Supabase...');
      const { data, error } = await supabase
        .from('carousel_images')
        .select('*')
        .order('order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('useCarouselImages: Successfully fetched images:', data);
      
      // Verify format
      if (data && data.length > 0) {
        const firstItem = data[0];
        console.log('useCarouselImages: Sample data format:', {
          hasId: !!firstItem.id,
          hasUrl: !!firstItem.image_url,
          hasAlt: firstItem.alt_text !== undefined,
          hasOrder: firstItem.order !== undefined
        });
      }
      
      setImages(data || []);
    } catch (err) {
      console.error('useCarouselImages: Error fetching carousel images:', err);
      setError(err.message || 'Failed to fetch images');
      toast({
        title: "Fetch Error",
        description: "Failed to load carousel images from database.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const addImage = async (imageData) => {
    try {
      console.log('useCarouselImages: Adding new image:', imageData);
      const { data, error } = await supabase
        .from('carousel_images')
        .insert([imageData])
        .select()
        .single();

      if (error) throw error;
      setImages(prev => [...prev, data].sort((a, b) => a.order - b.order));
      return data;
    } catch (error) {
      console.error('useCarouselImages: Error adding carousel image:', error);
      throw error;
    }
  };

  const updateImage = async (id, imageData) => {
    try {
      console.log('useCarouselImages: Updating image id', id, 'with data:', imageData);
      const { data, error } = await supabase
        .from('carousel_images')
        .update({ ...imageData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setImages(prev => prev.map(item => item.id === id ? data : item).sort((a, b) => a.order - b.order));
      return data;
    } catch (error) {
      console.error('useCarouselImages: Error updating carousel image:', error);
      throw error;
    }
  };

  const deleteImage = async (id) => {
    try {
      console.log('useCarouselImages: Deleting image id', id);
      const { error } = await supabase
        .from('carousel_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setImages(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('useCarouselImages: Error deleting carousel image:', error);
      throw error;
    }
  };

  return { images, loading, error, fetchImages, addImage, updateImage, deleteImage };
};