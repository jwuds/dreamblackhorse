import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export function useHomePageVideos(sectionFilter = null) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('home_page_videos')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (sectionFilter) {
        query = query.eq('section_name', sectionFilter);
      }

      const { data, error: err } = await query;
      if (err) throw err;
      setVideos(data || []);
    } catch (err) {
      console.error('Error fetching home page videos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [sectionFilter]);

  useEffect(() => {
    fetchVideos();

    const channel = supabase
      .channel('home_page_videos_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'home_page_videos' }, () => {
        fetchVideos();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchVideos]);

  const addVideo = async (videoData) => {
    const { data, error } = await supabase.from('home_page_videos').insert([videoData]).select();
    if (error) throw error;
    return data[0];
  };

  const updateVideo = async (id, updates) => {
    const { data, error } = await supabase
      .from('home_page_videos')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  };

  const deleteVideo = async (id) => {
    const { error } = await supabase.from('home_page_videos').delete().eq('id', id);
    if (error) throw error;
  };

  const reorderVideos = async (reorderedItems) => {
    const updates = reorderedItems.map(item => ({
      id: item.id,
      display_order: item.display_order
    }));
    
    for (const item of updates) {
      await updateVideo(item.id, { display_order: item.display_order });
    }
    fetchVideos();
  };

  return {
    videos,
    loading,
    error,
    fetchVideos,
    addVideo,
    updateVideo,
    deleteVideo,
    reorderVideos
  };
}