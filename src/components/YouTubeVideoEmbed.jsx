import React, { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { getYouTubeEmbedUrl } from '@/utils/youtubeUtils';

const YouTubeVideoEmbed = ({ videoId, title = 'YouTube Video' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!videoId) {
    return (
      <div className="w-full aspect-video bg-[#1a1a1a] rounded-xl border border-white/10 flex items-center justify-center">
        <div className="text-center p-8">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-400">Invalid video ID</p>
        </div>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(videoId);

  return (
    <div className="relative w-full aspect-video bg-[#0a0a0a] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a] z-10">
          <Loader2 className="w-12 h-12 text-[#d4af37] animate-spin" />
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a] z-10">
          <div className="text-center p-8">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-gray-400">Failed to load video</p>
            <p className="text-gray-600 text-sm mt-2">Please check your internet connection</p>
          </div>
        </div>
      )}

      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
};

export default YouTubeVideoEmbed;