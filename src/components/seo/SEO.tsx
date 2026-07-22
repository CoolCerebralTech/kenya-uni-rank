import { useEffect } from 'react';

// UniPulse SEO — sets document title + meta tags per page.
// Used by university profile pages for SEO (Google indexes each uni separately).

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string[];
  ogType?: string;
}

export function SEO({ title, description, keywords, ogType = 'website' }: SEOProps) {
  useEffect(() => {
    // Title
    document.title = `${title} | UniPulse Kenya`;

    // Meta description
    setMetaTag('description', description || 'UniPulse — compare Kenyan universities by fees, facilities, vibes, and real student sentiment from X.');

    // Meta keywords
    if (keywords?.length) {
      setMetaTag('keywords', keywords.join(', '));
    }

    // Open Graph tags
    setMetaProperty('og:title', `${title} | UniPulse Kenya`);
    setMetaProperty('og:description', description || 'Compare Kenyan universities by fees, facilities, vibes, and real student sentiment.');
    setMetaProperty('og:type', ogType);
    setMetaProperty('og:site_name', 'UniPulse Kenya');

    // Twitter card
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', `${title} | UniPulse Kenya`);
    setMetaTag('twitter:description', description || 'Compare Kenyan universities — fees, facilities, vibes, and real student sentiment.');

    // Canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = window.location.href;
      document.head.appendChild(link);
    }
  }, [title, description, keywords, ogType]);

  return null;
}

function setMetaTag(name: string, content: string) {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function setMetaProperty(property: string, content: string) {
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}
