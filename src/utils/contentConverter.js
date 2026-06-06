export const convertHtmlToMarkdown = (html) => {
  if (!html) return '';

  let markdown = html;

  // Headings
  markdown = markdown.replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n');
  markdown = markdown.replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n');
  markdown = markdown.replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n');
  markdown = markdown.replace(/<h4>(.*?)<\/h4>/gi, '#### $1\n\n');

  // Bold and Italic
  markdown = markdown.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
  markdown = markdown.replace(/<b>(.*?)<\/b>/gi, '**$1**');
  markdown = markdown.replace(/<em>(.*?)<\/em>/gi, '*$1*');
  markdown = markdown.replace(/<i>(.*?)<\/i>/gi, '*$1*');

  // Lists
  markdown = markdown.replace(/<ul>/gi, '\n');
  markdown = markdown.replace(/<\/ul>/gi, '\n');
  markdown = markdown.replace(/<li>(.*?)<\/li>/gi, '- $1\n');
  
  markdown = markdown.replace(/<ol>/gi, '\n');
  markdown = markdown.replace(/<\/ol>/gi, '\n');
  // Simple ordered list fallback since we don't have an index context easily in regex
  markdown = markdown.replace(/<li>(.*?)<\/li>/gi, '1. $1\n'); 

  // Paragraphs and breaks
  markdown = markdown.replace(/<p>/gi, '');
  markdown = markdown.replace(/<\/p>/gi, '\n\n');
  markdown = markdown.replace(/<br\s*[\/]?>/gi, '\n');

  // Tables (basic approximation)
  markdown = markdown.replace(/<table>/gi, '\n');
  markdown = markdown.replace(/<\/table>/gi, '\n');
  markdown = markdown.replace(/<tr>/gi, '');
  markdown = markdown.replace(/<\/tr>/gi, '|\n');
  markdown = markdown.replace(/<td>(.*?)<\/td>/gi, '| $1 ');
  markdown = markdown.replace(/<th>(.*?)<\/th>/gi, '| **$1** ');

  // Clean up extra spaces and Word artifacts
  markdown = markdown.replace(/&nbsp;/g, ' ');
  markdown = markdown.replace(/\n{3,}/g, '\n\n'); // Max 2 newlines
  
  // Remove remaining HTML tags
  markdown = markdown.replace(/<[^>]*>?/gm, '');

  return markdown.trim();
};

export const extractContentSections = (markdown, rawText) => {
  const lines = markdown.split('\n');
  let h1_headline = '';
  
  // Find first H1
  const h1Match = markdown.match(/^#\s+(.*)$/m);
  if (h1Match) {
    h1_headline = h1Match[1];
  } else {
    // Fallback to first non-empty line
    const firstLine = lines.find(line => line.trim().length > 0 && !line.startsWith('#'));
    if (firstLine) h1_headline = firstLine.trim();
  }

  // Extract introduction (first paragraph after heading)
  const paragraphs = markdown.split('\n\n').filter(p => p.trim().length > 0 && !p.startsWith('#'));
  const introduction = paragraphs.length > 0 ? paragraphs[0] : '';
  
  // Extract conclusion (last paragraph if more than 2 paragraphs)
  const conclusion = paragraphs.length > 2 ? paragraphs[paragraphs.length - 1] : '';

  return {
    h1_headline,
    introduction,
    conclusion,
    content: markdown
  };
};