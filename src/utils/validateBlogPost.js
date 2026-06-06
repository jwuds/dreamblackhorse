export const isValidUUID = (id) => {
  if (!id) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

export const validateBlogPost = (post) => {
  const errors = [];
  
  if (!post.id || !isValidUUID(post.id)) {
    errors.push('Invalid or missing ID (must be a valid UUID).');
  }
  
  if (!post.title || post.title.trim() === '') {
    errors.push('Title is required and cannot be empty.');
  }
  
  if (!post.content || post.content.trim() === '') {
    errors.push('Content is required and cannot be empty.');
  }
  
  if (!post.author || post.author.trim() === '') {
    errors.push('Author is required and cannot be empty.');
  }
  
  if (post.status !== 'draft' && post.status !== 'published') {
    errors.push('Status must be either "draft" or "published".');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};