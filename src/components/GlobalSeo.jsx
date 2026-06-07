import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';

const GlobalSeo = () => {
  const location = useLocation();
  const [seoData, setSeoData] = useState({
    // Q-001 soft retitling · 2026-06-07: brand-first to reduce title collision
    // with /pages/digital-marketing-course-in-nagpur. Same keywords preserved.
    meta_title: 'Telzon Academy | Digital Marketing Course in Nagpur | Free Demo Class',
    meta_description: "Telzon Academy — Nagpur's top digital marketing course with 95% placement support. Practical SEO, Google Ads, social media, and AI marketing training. Book a free demo class today.",
    og_title: 'Telzon Academy | Digital Marketing Course in Nagpur | Free Demo Class',
    og_description: 'Telzon Academy Nagpur — practical digital marketing training with 95% placement. Free demo available. Learn SEO, Google Ads, social media, AI marketing & more.'
  });

  useEffect(() => {
    const fetchSeoSettings = async () => {
      try {
        const { data } = await supabase
          .from('seoSettings')
          .select('meta_title, meta_description, og_title, og_description')
          .eq('page_key', 'home')
          .maybeSingle();
        if (data) {
          setSeoData(prev => ({
            meta_title: data.meta_title || prev.meta_title,
            meta_description: data.meta_description || prev.meta_description,
            og_title: data.og_title || prev.og_title,
            og_description: data.og_description || prev.og_description
          }));
        }
      } catch (e) {
        console.error('SEO fetch error:', e);
      }
    };
    fetchSeoSettings();
  }, []);

  // Dynamic canonical: each page points to its own URL (fixes WRONG_CANONICAL for all 63 inner pages)
  const canonicalUrl = 'https://telzonacademy.in' + location.pathname;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Telzon Academy',
    alternateName: 'Telzon Digital Marketing Academy',
    description: 'Telzon Academy is Nagpur\'s leading digital marketing training institute offering practical courses in SEO, Google Ads, social media marketing, content marketing and analytics with 95% placement assistance.',
    url: canonicalUrl,
    telephone: '+91-9307189776',
    email: 'connect@telzonacademy.in',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Nagpur, Maharashtra',
      addressLocality: 'Nagpur',
      addressRegion: 'Maharashtra',
      postalCode: '440001',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 21.1458,
      longitude: 79.0882
    },
    image: 'https://images.unsplash.com/photo-1695133139074-d0ab15d6d7da',
    logo: 'https://telzonacademy.in/telzon-logo-white-1024.png',
    priceRange: '₹₹',
    openingHours: 'Mo-Sa 09:00-20:00',
    sameAs: ['https://www.instagram.com/telzonacademy/'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Digital Marketing Courses',
      itemListElement: [
        {
          '@type': 'Course',
          name: 'Digital Marketing Course in Nagpur',
          description: 'Comprehensive digital marketing course covering SEO, Google Ads, social media, content marketing and analytics with placement assistance.',
          provider: { '@type': 'Organization', name: 'Telzon Academy', sameAs: canonicalUrl },
          courseMode: 'blended',
          educationalLevel: 'beginner',
          inLanguage: 'en',
          offers: {
            '@type': 'Offer',
            category: 'Digital Marketing Training',
            availability: 'https://schema.org/InStock'
          }
        }
      ]
    }
  };

  return (
    <Helmet>
      <title>{seoData.meta_title}</title>
      <meta name="description" content={seoData.meta_description} />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={seoData.og_title} />
      <meta property="og:description" content={seoData.og_description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content="https://images.unsplash.com/photo-1695133139074-d0ab15d6d7da" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:site_name" content="Telzon Academy" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoData.og_title} />
      <meta name="twitter:description" content={seoData.og_description} />
      <meta name="twitter:image" content="https://images.unsplash.com/photo-1695133139074-d0ab15d6d7da" />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default GlobalSeo;
