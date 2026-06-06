import { supabase } from '@/lib/customSupabaseClient';

export const getAboutSectionImage = async (section) => {
  try {
    const { data, error } = await supabase
      .from('site_images')
      .select('*')
      .eq('section', section)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    return data || null;
  } catch (error) {
    console.error(`Error fetching image for ${section}:`, error);
    return null;
  }
};

export const getImageFallback = (section) => {
  const fallbacks = {
    'about_story': 'https://images.unsplash.com/photo-1613437190836-d59585104264',
    'about_mission': 'https://images.unsplash.com/photo-1652462098615-762377492dad',
    'about_vision': 'https://images.unsplash.com/photo-1604340737157-324338c888d3',
  };
  return {
    file_path: fallbacks[section] || 'https://images.unsplash.com/photo-1518775006023-10bdc4ada7c0',
    alt_text: `${section.replace('_', ' ')} fallback image`,
    isFallback: true
  };
};

export const validateImageExists = async (imageId) => {
  if (!imageId) return false;
  try {
    const { data, error } = await supabase
      .from('site_images')
      .select('id')
      .eq('id', imageId)
      .single();
    if (error) return false;
    return !!data;
  } catch (err) {
    return false;
  }
};

export const checkImagePublished = async (imageId) => {
  if (!imageId) return false;
  try {
    const { data, error } = await supabase
      .from('site_images')
      .select('status')
      .eq('id', imageId)
      .single();
    if (error) return false;
    return data?.status === 'published';
  } catch (err) {
    return false;
  }
};