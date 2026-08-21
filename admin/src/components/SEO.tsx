import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
}

export const SEO = ({ title = 'COSMALAC | Control Center', description = 'Authorized staff control center.' }: SEOProps) => {
  useEffect(() => {
    document.title = title.includes('COSMALAC') ? title : `${title} | COSMALAC Control Center`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
};

export default SEO;
