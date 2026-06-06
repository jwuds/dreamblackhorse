import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { retryFetch } from '@/utils/retryFetch';

export const useAffiliates = () => {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchAffiliates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await retryFetch(async () => {
        const { data, error } = await supabase
          .from('affiliates')
          .select('*')
          .order('order', { ascending: true })
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      });

      setAffiliates(data || []);
    } catch (err) {
      console.error('Error fetching affiliates:', err);
      setError(err.message || 'Failed to load affiliates');
      setAffiliates([]); // Fallback to empty array
      toast({
        title: "Error",
        description: "Failed to load affiliates. Please check your connection.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const addAffiliate = async (affiliateData) => {
    try {
      const data = await retryFetch(async () => {
        const { data, error } = await supabase
          .from('affiliates')
          .insert([affiliateData])
          .select()
          .single();

        if (error) throw error;
        return data;
      });

      setAffiliates(prev => [...prev, data].sort((a, b) => a.order - b.order));
      return data;
    } catch (error) {
      console.error('Error adding affiliate:', error);
      throw error;
    }
  };

  const updateAffiliate = async (id, affiliateData) => {
    try {
      const data = await retryFetch(async () => {
        const { data, error } = await supabase
          .from('affiliates')
          .update({ ...affiliateData, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      });

      setAffiliates(prev => prev.map(item => item.id === id ? data : item).sort((a, b) => a.order - b.order));
      return data;
    } catch (error) {
      console.error('Error updating affiliate:', error);
      throw error;
    }
  };

  const deleteAffiliate = async (id) => {
    try {
      await retryFetch(async () => {
        const { error } = await supabase
          .from('affiliates')
          .delete()
          .eq('id', id);

        if (error) throw error;
      });

      setAffiliates(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting affiliate:', error);
      throw error;
    }
  };

  return {
    affiliates,
    loading,
    error,
    fetchAffiliates,
    addAffiliate,
    updateAffiliate,
    deleteAffiliate
  };
};