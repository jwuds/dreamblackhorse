import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useSupabaseCache } from './useSupabaseCache';

// 15 minutes cache
const CACHE_KEY = 'supabase_testimonials_all';
const CACHE_TTL = 15 * 60 * 1000;

export const useSupabaseTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getCachedData, setCachedData, invalidateCache } = useSupabaseCache();

  const fetchTestimonials = useCallback(async (ignoreCache = false) => {
    try {
      setLoading(true);
      setError(null);

      if (!ignoreCache) {
        const cached = getCachedData(CACHE_KEY, CACHE_TTL);
        if (cached) {
          setTestimonials(cached);
          setLoading(false);
          return;
        }
      }

      const { data, error: fetchError } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setTestimonials(data || []);
      setCachedData(CACHE_KEY, data || []);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getCachedData, setCachedData]);

  const addTestimonial = async (testimonialData) => {
    try {
      const { data, error: insertError } = await supabase
        .from('testimonials')
        .insert([testimonialData])
        .select()
        .single();

      if (insertError) throw insertError;
      
      // Update local state immediately for snappy UI
      setTestimonials(prev => [data, ...prev]);
      invalidateCache(CACHE_KEY);
      return data;
    } catch (err) {
      console.error('Error adding testimonial:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTestimonials();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('testimonials_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, () => {
        invalidateCache(CACHE_KEY);
        fetchTestimonials(true);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchTestimonials, invalidateCache]);

  return { testimonials, loading, error, addTestimonial, refetch: () => fetchTestimonials(true) };
};