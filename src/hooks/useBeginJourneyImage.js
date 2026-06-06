import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { retryFetch } from '@/utils/retryFetch';

export const useBeginJourneyImage = () => {
  const [journeyImage, setJourneyImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchImage = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await retryFetch(async () => {
        const { data, error } = await supabase
          .from('begin_journey_image')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        return data;
      });

      setJourneyImage(data);
    } catch (err) {
      console.error('Error fetching journey image:', err);
      setError(err.message || 'Failed to fetch journey image');
      setJourneyImage(null); // Fallback to null
    } finally {
      setLoading(false);
    }
  }, []);

  const saveImage = async (imageData) => {
    try {
      const data = await retryFetch(async () => {
        if (journeyImage?.id) {
          const { data, error } = await supabase
            .from('begin_journey_image')
            .update({ ...imageData, updated_at: new Date().toISOString() })
            .eq('id', journeyImage.id)
            .select()
            .single();

          if (error) throw error;
          return data;
        } else {
          const { data, error } = await supabase
            .from('begin_journey_image')
            .insert([imageData])
            .select()
            .single();

          if (error) throw error;
          return data;
        }
      });

      setJourneyImage(data);
      return data;
    } catch (error) {
      console.error('Error saving journey image:', error);
      throw error;
    }
  };

  const deleteImage = async () => {
    if (!journeyImage?.id) return;
    try {
      await retryFetch(async () => {
        const { error } = await supabase
          .from('begin_journey_image')
          .delete()
          .eq('id', journeyImage.id);

        if (error) throw error;
      });

      setJourneyImage(null);
    } catch (error) {
      console.error('Error deleting journey image:', error);
      throw error;
    }
  };

  return { journeyImage, loading, error, fetchImage, saveImage, deleteImage };
};