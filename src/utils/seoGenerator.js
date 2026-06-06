export const generateSlug = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w-]+/g, '')     // Remove all non-word chars
    .replace(/--+/g, '-');       // Replace multiple - with single -
};

export const generateMetaDescription = (content, h1) => {
  if (!content) return '';
  // Clean content and get first text block
  const cleanContent = content.replace(/#+ /g, '').replace(/\n/g, ' ').trim();
  const description = cleanContent.length > 150 
    ? cleanContent.substring(0, 150).trim() + '...'
    : cleanContent;
    
  return description || h1 || 'Discover more about our premium KFPS Friesian horses and equestrian services.';
};

export const extractKeywords = (content, h1) => {
  const commonWords = new Set(['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me']);
  
  const text = `${h1} ${content}`.toLowerCase();
  const words = text.match(/\b\w{4,}\b/g) || []; // Words with 4+ chars
  
  const wordCount = {};
  words.forEach(word => {
    if (!commonWords.has(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });
  
  // Sort by frequency and get top 5
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(entry => entry[0])
    .join(', ');
};

export const suggestAltText = (imageContext, h1) => {
  return `${h1 || 'Dream Black Horse'} - ${imageContext || 'Featured equestrian image'}`;
};