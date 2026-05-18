import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export const useSEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url 
}: SEOProps) => {
  const siteName = 'YumCircle';
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - The Food Community`;

  useEffect(() => {
    // Update Title
    document.title = fullTitle;

    // Update Meta Tags
    const updateMeta = (name: string, content: string, property: boolean = false) => {
      let element = document.querySelector(`meta[${property ? 'property' : 'name'}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(property ? 'property' : 'name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    if (description) {
      updateMeta('description', description);
      updateMeta('og:description', description, true);
    }

    if (keywords) {
      updateMeta('keywords', keywords);
    }

    if (image) {
      updateMeta('og:image', image, true);
    }

    if (url) {
      updateMeta('og:url', url, true);
    }

    updateMeta('og:title', fullTitle, true);
    updateMeta('og:type', 'website', true);

  }, [fullTitle, description, keywords, image, url]);
};

export const SEO = (props: SEOProps) => {
  useSEO(props);
  return null;
};
