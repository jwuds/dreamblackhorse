import { supabase } from '@/lib/customSupabaseClient';

export const getImageForSection = async (section, imageType = null) => {
  try {
    let query = supabase
      .from('site_images')
      .select('*')
      .eq('section', section)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(1);

    if (imageType) {
      query = query.eq('image_type', imageType);
    }

    const { data, error } = await query.single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is 0 rows returned
    
    return data || handleMissingImage(section);
  } catch (error) {
    console.error(`Error fetching image for section ${section}:`, error);
    return handleMissingImage(section);
  }
};

export const getImageById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('site_images')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching image by id ${id}:`, error);
    return null;
  }
};

export const getPublishedImage = async (section) => {
  return getImageForSection(section);
};

export const handleMissingImage = (section) => {
  console.warn(`No published image found for section: ${section}`);
  return {
    file_path: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTFhIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzQ0NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD4KPC9zdmc+",
    alt_text: `Placeholder for ${section}`,
    isPlaceholder: true
  };
};

export const validateImageExists = async (id) => {
  const img = await getImageById(id);
  return !!img;
};

export const getImageMetadata = async (id) => {
  const img = await getImageById(id);
  return img ? img.metadata : null;
};

export const trackImageUsage = async (id) => {
  try {
    // Increment usage_count safely using RPC if we had one, but simple update for now
    const { data: current } = await supabase.from('site_images').select('usage_count').eq('id', id).single();
    if (current) {
      await supabase
        .from('site_images')
        .update({ usage_count: (current.usage_count || 0) + 1 })
        .eq('id', id);
    }
  } catch (error) {
    console.error(`Error tracking usage for image ${id}:`, error);
  }
};