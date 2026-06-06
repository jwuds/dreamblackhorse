import { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export const useMediaUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.');
    }
    if (file.size > MAX_SIZE) {
      throw new Error('File size exceeds 10MB limit.');
    }
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        if (img.width < 100 || img.height < 100 || img.width > 4000 || img.height > 4000) {
          reject(new Error('Invalid dimensions. Must be between 100x100 and 4000x4000.'));
        } else {
          resolve({ width: img.width, height: img.height });
        }
      };
      img.onerror = () => reject(new Error('Failed to load image for validation.'));
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadMedia = async (file, metadata = {}) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      // 1. Validate
      const dimensions = await validateFile(file);

      // 2. Upload to Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const folder = metadata.section || 'other';
      const filePath = `${folder}/${fileName}`;

      setProgress(25);

      const { error: uploadError, data } = await supabase.storage
        .from('site-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      setProgress(75);

      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

      // 4. Save to Database
      const dbData = {
        section: metadata.section || 'other',
        image_type: metadata.image_type || 'general',
        file_path: publicUrl,
        file_name: file.name,
        file_size: file.size,
        image_width: dimensions.width,
        image_height: dimensions.height,
        alt_text: metadata.alt_text || '',
        description: metadata.description || '',
        status: metadata.status || 'draft',
        metadata: metadata.customMeta || {}
      };

      const { data: record, error: dbError } = await supabase
        .from('site_images')
        .insert([dbData])
        .select()
        .single();

      if (dbError) throw dbError;

      setProgress(100);
      return record;

    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadMedia, isUploading, progress, error };
};