export const setPageTitle = (title) => {
  if (typeof document !== 'undefined') {
    document.title = title;
  }
};

export const setMetaDescription = (description) => {
  if (typeof document !== 'undefined') {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;
  }
};

export const setCanonicalTag = (url) => {
  if (typeof document !== 'undefined') {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }
};

export const setOGTags = (ogData) => {
  if (typeof document !== 'undefined') {
    Object.keys(ogData).forEach(key => {
      const property = `og:${key}`;
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        document.head.appendChild(metaTag);
      }
      metaTag.content = ogData[key];
    });
  }
};