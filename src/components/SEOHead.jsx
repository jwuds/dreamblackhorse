import React from 'react';
import { Helmet } from 'react-helmet';
import { SEO_DEFAULTS } from '@/lib/seoPageConfig';

const SEOHead = ({
  title = SEO_DEFAULTS.title,
  description = SEO_DEFAULTS.description,
  canonical = '',
  ogData = {},
  keywords = 'friesian horses for sale, KFPS friesian horse, black horses for sale, premium horses Florida, Mt Dora horse farm',
  schema = null,
}) => {
  const { baseUrl } = SEO_DEFAULTS;
  const canonicalUrl = canonical
    ? canonical.startsWith('http')
      ? canonical
      : `${baseUrl}${canonical}`
    : baseUrl;

  const defaultOgData = {
    title,
    description,
    image: SEO_DEFAULTS.image,
    url: canonicalUrl,
    type: 'website',
    site_name: 'Dream Black Horse',
  };

  const finalOgData = { ...defaultOgData, ...ogData };

  return (
    <>
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

      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </>
  );
};

export default SEOHead;
