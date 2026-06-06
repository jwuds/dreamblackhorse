import React from 'react';
import { Helmet } from 'react-helmet';

const SEOHead = ({
  title = "Dream Black Horse - Premium Friesian & Black Horse Sales",
  description = "Discover premium black horses for sale at Dream Black Horse. Browse our collection of Friesian and other quality horses. Expert breeding, sales, and worldwide delivery.",
  canonical = "",
  ogData = {},
  keywords = "black horses for sale, Friesian horses, premium horses, equestrian, horse breeding, Dream Black Horse"
}) => {

  const baseUrl = "https://dreamblackhorse.com";
  const canonicalUrl = canonical
    ? (canonical.startsWith('http') ? canonical : `${baseUrl}${canonical}`)
    : baseUrl;

  const defaultOgData = {
    title,
    description,
    image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a",
    url: canonicalUrl,
    type: "website",
    site_name: "Dream Black Horse"
  };

  const finalOgData = { ...defaultOgData, ...ogData };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {Object.entries(finalOgData).map(([key, value]) => (
        <meta key={key} property={`og:${key}`} content={value} />
      ))}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalOgData.title} />
      <meta name="twitter:description" content={finalOgData.description} />
      <meta name="twitter:image" content={finalOgData.image} />
    </Helmet>
  );
};

export default SEOHead;
