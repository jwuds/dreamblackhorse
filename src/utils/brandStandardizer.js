export const standardizeBranding = (text) => {
  if (!text) return '';
  
  let result = text;
  
  // Standardize Brand Name
  result = result.replace(/Dream Black Horse Farm/gi, 'Dream Black Horse');
  result = result.replace(/\bDBH\b/g, 'Dream Black Horse');
  result = result.replace(/Dream Black Horse Stud/gi, 'Dream Black Horse');
  
  // Standardize Terminology
  result = result.replace(/KFPS Friesian[s]?/gi, 'KFPS Friesian');
  result = result.replace(/friesian/gi, 'Friesian'); // Capitalize Friesian
  result = result.replace(/Kfps/g, 'KFPS');
  
  // Standardize common terms
  result = result.replace(/dressage/gi, 'Dressage');
  result = result.replace(/breeding/gi, 'Breeding');
  
  return result;
};