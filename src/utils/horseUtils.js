export const parseHorseFields = (product) => {
  if (!product) return {};

  const fields = {
    age: '',
    height: '',
    temperament: '',
    trainingLevel: '',
    discipline: '',
    availability: 'Available',
    sire: '',
    dam: '',
    category: 'Other'
  };

  // Parse from additional_info provided by Online Store API
  if (product.additional_info && Array.isArray(product.additional_info)) {
    product.additional_info.forEach(info => {
      const title = (info.title || '').toLowerCase();
      const desc = (info.description || '').replace(/<[^>]*>?/gm, '').trim();
      
      if (title.includes('age')) fields.age = desc;
      else if (title.includes('height')) fields.height = desc;
      else if (title.includes('temperament')) fields.temperament = desc;
      else if (title.includes('training')) fields.trainingLevel = desc;
      else if (title.includes('discipline')) fields.discipline = desc;
      else if (title.includes('sire')) fields.sire = desc;
      else if (title.includes('dam')) fields.dam = desc;
      else if (title.includes('category')) fields.category = desc;
    });
  }

  // Parse from description if additional_info is missing/empty
  if (product.description) {
    const desc = product.description;
    if (!fields.age) { const m = desc.match(/Age:\s*([^<]+)/i); if (m) fields.age = m[1].trim(); }
    if (!fields.height) { const m = desc.match(/Height:\s*([^<]+)/i); if (m) fields.height = m[1].trim(); }
    if (!fields.temperament) { const m = desc.match(/Temperament:\s*([^<]+)/i); if (m) fields.temperament = m[1].trim(); }
  }

  // Determine availability based on ribbon_text, purchasable flag, or inventory
  if (product.ribbon_text) {
    fields.availability = product.ribbon_text;
  } else if (product.variants && product.variants.length > 0) {
    const variant = product.variants[0];
    if (variant.manage_inventory && variant.inventory_quantity <= 0) {
      fields.availability = 'Sold';
    } else if (!product.purchasable) {
      fields.availability = 'Reserved';
    }
  }

  // Determine Category if not explicitly set
  if (!fields.category || fields.category === 'Other') {
    const titleLower = (product.title || '').toLowerCase();
    if (titleLower.includes('stallion')) fields.category = 'Stallion';
    else if (titleLower.includes('mare')) fields.category = 'Mare';
    else if (titleLower.includes('gelding')) fields.category = 'Gelding';
    else if (titleLower.includes('foal') || titleLower.includes('colt') || titleLower.includes('filly')) fields.category = 'Foal';
  }

  return fields;
};

export const formatHorseAge = (age) => {
  if (!age || age.trim() === '') return 'N/A';
  return age.toString().toLowerCase().includes('year') ? age : `${age} Years`;
};

export const formatHorseHeight = (height) => {
  if (!height || height.trim() === '') return 'N/A';
  return height.toString().toLowerCase().includes('hh') || height.toString().toLowerCase().includes('hands') || height.toString().toLowerCase().includes('cm') || height.toString().toLowerCase().includes('m') ? height : `${height} hh`;
};

export const getAvailabilityColor = (status) => {
  const s = (status || 'available').toLowerCase();
  if (s.includes('available')) return 'bg-green-500/20 text-green-400 border-green-500/30';
  if (s.includes('reserved') || s.includes('pending')) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  if (s.includes('sold')) return 'bg-red-500/20 text-red-400 border-red-500/30';
  return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
};