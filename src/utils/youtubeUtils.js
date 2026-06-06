/**
 * YouTube URL utilities for extracting video IDs and validating URLs
 */

/**
 * Extracts YouTube video ID from various URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - URLs with timestamps and other parameters
 * 
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null if not found
 */
export const extractYouTubeVideoId = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const cleanUrl = url.trim();
  
  // Pattern 1: youtube.com/watch?v=VIDEO_ID
  const watchPattern = /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/;
  const watchMatch = cleanUrl.match(watchPattern);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }

  // Pattern 2: youtu.be/VIDEO_ID
  const shortPattern = /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const shortMatch = cleanUrl.match(shortPattern);
  if (shortMatch && shortMatch[1]) {
    return shortMatch[1];
  }

  // Pattern 3: youtube.com/embed/VIDEO_ID
  const embedPattern = /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
  const embedMatch = cleanUrl.match(embedPattern);
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1];
  }

  // Pattern 4: youtube.com/v/VIDEO_ID
  const vPattern = /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/;
  const vMatch = cleanUrl.match(vPattern);
  if (vMatch && vMatch[1]) {
    return vMatch[1];
  }

  return null;
};

/**
 * Validates a YouTube URL and extracts video ID
 * 
 * @param {string} url - YouTube URL to validate
 * @returns {Object} - {valid: boolean, videoId: string|null, error: string|null}
 */
export const validateYouTubeUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return {
      valid: false,
      videoId: null,
      error: 'URL is required and must be a string'
    };
  }

  const cleanUrl = url.trim();

  if (cleanUrl.length === 0) {
    return {
      valid: false,
      videoId: null,
      error: 'URL cannot be empty'
    };
  }

  // Check if URL contains youtube domain
  const isYouTubeUrl = /(?:youtube\.com|youtu\.be)/.test(cleanUrl);
  if (!isYouTubeUrl) {
    return {
      valid: false,
      videoId: null,
      error: 'URL must be a valid YouTube link'
    };
  }

  // Extract video ID
  const videoId = extractYouTubeVideoId(cleanUrl);

  if (!videoId) {
    return {
      valid: false,
      videoId: null,
      error: 'Could not extract video ID from URL. Please use a valid YouTube URL format.'
    };
  }

  // Validate video ID format (11 characters, alphanumeric, dash, underscore)
  const isValidId = /^[a-zA-Z0-9_-]{11}$/.test(videoId);
  if (!isValidId) {
    return {
      valid: false,
      videoId: null,
      error: 'Extracted video ID is not in valid YouTube format'
    };
  }

  return {
    valid: true,
    videoId,
    error: null
  };
};

/**
 * Generates YouTube embed URL from video ID
 * 
 * @param {string} videoId - YouTube video ID
 * @returns {string} - Embed URL
 */
export const getYouTubeEmbedUrl = (videoId) => {
  if (!videoId) return '';
  return `https://www.youtube.com/embed/${videoId}`;
};

/**
 * Generates YouTube thumbnail URL from video ID
 * 
 * @param {string} videoId - YouTube video ID
 * @param {string} quality - Thumbnail quality (default, hq, mq, sd, maxres)
 * @returns {string} - Thumbnail URL
 */
export const getYouTubeThumbnailUrl = (videoId, quality = 'hqdefault') => {
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};