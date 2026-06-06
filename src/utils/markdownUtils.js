export const extractTOC = (markdown) => {
  if (!markdown) return [];
  const regex = /^(##|###)\s+(.+)$/gm;
  const toc = [];
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    toc.push({
      level: match[1].length, // 2 for ##, 3 for ###
      text: match[2],
      id: match[2].toLowerCase().replace(/[^\w]+/g, '-')
    });
  }
  return toc;
};

export const parseMarkdown = (markdown) => {
  if (!markdown) return '';
  
  let html = markdown
    .replace(/^###\s+(.+)$/gm, (m, p1) => `<h3 id="${p1.toLowerCase().replace(/[^\w]+/g, '-')}">${p1}</h3>`)
    .replace(/^##\s+(.+)$/gm, (m, p1) => `<h2 id="${p1.toLowerCase().replace(/[^\w]+/g, '-')}">${p1}</h2>`)
    .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^\>\s+(.+)$/gm, '<blockquote>$1</blockquote>');
    
  html = html.replace(/^\-\s+(.+)$/gm, '<li>$1</li>');
  
  html = html.split(/\n\n+/).map(p => {
    const trimmed = p.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<blockquote')) {
      return trimmed;
    }
    if (trimmed.startsWith('<li')) {
       return `<ul>${trimmed}</ul>`;
    }
    return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`;
  }).join('\n');
  
  return html;
};