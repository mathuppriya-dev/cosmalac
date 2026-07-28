import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
  schema?: Record<string, any>;
}

export const SEO = ({ title, description, canonicalPath, ogImage, schema }: SEOProps) => {
  useEffect(() => {
    // 1. Update Title
    document.title = `${title} | COSMALAC Premium Skincare`;

    // 2. Update Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 3. Update Canonical link
    const domain = window.location.origin;
    const currentPath = canonicalPath || window.location.pathname;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', `${domain}${currentPath}`);

    // 4. Update Open Graph / Social Tags
    const ogTags = {
      'og:title': title,
      'og:description': description,
      'og:type': 'website',
      'og:url': `${domain}${currentPath}`,
      'og:image': ogImage || `${domain}/images/luxury_skincare_hero.png`,
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description
    };

    Object.entries(ogTags).forEach(([key, val]) => {
      let metaTag = document.querySelector(`meta[property="${key}"]`) || document.querySelector(`meta[name="${key}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        if (key.startsWith('og:')) {
          metaTag.setAttribute('property', key);
        } else {
          metaTag.setAttribute('name', key);
        }
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', val);
    });

    // 5. Ingest JSON-LD Schema
    const existingSchemaScript = document.getElementById('json-ld-schema');
    if (existingSchemaScript) {
      existingSchemaScript.remove();
    }

    if (schema) {
      const script = document.createElement('script');
      script.id = 'json-ld-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [title, description, canonicalPath, ogImage, schema]);

  return null; // Side-effect only component
};

// Ready-made base schemas for organization & products
export const getOrgSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  'name': 'COSMALAC',
  'url': 'https://www.cosmalac.com',
  'logo': 'https://www.cosmalac.com/logo.png',
  'foundingDate': '2016',
  'description': 'Manufacturer of premium skincare, beauty and cosmetics.',
  'contactPoint': {
    '@type': 'ContactPoint',
    'telephone': '+94-11-234-5678',
    'contactType': 'customer support',
    'areaServed': 'LK',
    'availableLanguage': ['English', 'Sinhala', 'Tamil']
  }
});
