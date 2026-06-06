/**
 * Utility functions for horse URL slugs
 */

export const formatHorseUrlSlug = (name) => {
  if (!name) return 'prod_unknown';
  // Remove all non-alphanumeric characters to create formats like "BlackBeauty"
  const cleanName = name.replace(/[^a-zA-Z0-9]/g, '');
  return `prod_${cleanName}`;
};

export const parseHorseUrlSlug = (slug) => {
  if (!slug) return '';
  // Removes the "prod_" prefix
  return slug.replace(/^prod_/, '');
};

export const matchHorseBySlug = (productTitle, slug) => {
  if (!productTitle || !slug) return false;
  return formatHorseUrlSlug(productTitle).toLowerCase() === slug.toLowerCase();
};