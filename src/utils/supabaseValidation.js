import { logValidationError } from '@/utils/errorLogger';

export const validateJsonbField = (field, fieldName) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      logValidationError(fieldName, field, 'Valid JSON Array');
      return [];
    }
  }
  return [];
};

export const validateSlug = (slug) => {
  if (!slug || typeof slug !== 'string') return false;
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug.trim());
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export const validateUUID = (id) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

export const validateBlogPost = (post) => {
  const errors = [];
  
  if (!post.title || typeof post.title !== 'string') errors.push('Title is required and must be a string.');
  if (!post.slug || !validateSlug(post.slug)) errors.push('Invalid or missing slug. Must be lowercase alphanumeric separated by hyphens.');
  if (post.status && !['draft', 'published', 'archived'].includes(post.status)) errors.push('Status must be draft, published, or archived.');
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: {
      ...post,
      tags: validateJsonbField(post.tags, 'tags'),
      keywords: validateJsonbField(post.keywords, 'keywords'),
      faq_items: validateJsonbField(post.faq_items, 'faq_items'),
      internal_links: validateJsonbField(post.internal_links, 'internal_links'),
      live_links: validateJsonbField(post.live_links, 'live_links'),
    }
  };
};

export const validateDataTypes = (data, schema) => {
  const errors = [];
  for (const [key, type] of Object.entries(schema)) {
    if (data[key] !== undefined && data[key] !== null) {
      if (type === 'array' && !Array.isArray(data[key])) {
        errors.push(`${key} must be an array`);
      } else if (type !== 'array' && typeof data[key] !== type) {
        errors.push(`${key} must be of type ${type}`);
      }
    }
  }
  return { isValid: errors.length === 0, errors };
};