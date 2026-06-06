import React, { useState, useEffect } from 'react';
import { getImageForSection, getImageById } from '@/utils/imageIntegration';
import { addCacheBuster } from '@/utils/cacheManager';

const SiteImage = ({ 
  section, 
  id, 
  imageType, 
  alt, 
  className = "", 
  style = {}, 
  fallbackSrc = null 
}) => {
  const [imageInfo, setImageInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
      try {
        let data;
        if (id) {
          data = await getImageById(id);
        } else if (section) {
          data = await getImageForSection(section, imageType);
        }
        
        if (data && !data.isPlaceholder) {
          setImageInfo(data);
        } else {
          setImageInfo({ file_path: fallbackSrc || data?.file_path, alt_text: alt || data?.alt_text });
          if (!fallbackSrc && !data?.file_path) setError(true);
        }
      } catch (err) {
        console.error("Failed to load SiteImage:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [section, id, imageType, fallbackSrc, alt]);

  if (loading) {
    return <div className={`animate-pulse bg-white/10 ${className}`} style={style} />;
  }

  if (error || !imageInfo?.file_path) {
    // Show simple placeholder on error
    return (
      <div className={`bg-white/5 flex items-center justify-center border border-white/10 text-gray-500 text-xs text-center p-4 ${className}`} style={style}>
        {alt || 'Image unavailable'}
      </div>
    );
  }

  const finalSrc = addCacheBuster(imageInfo.file_path);

  return (
    <img
      src={finalSrc}
      alt={imageInfo.alt_text || alt || `Image for ${section}`}
      className={className}
      style={style}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
};

export default SiteImage;