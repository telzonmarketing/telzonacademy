'use strict';

/**
 * NAPProfile — single source of truth for Name, Address, Phone + every
 * other business detail directories may ask for. Consistency across
 * directories is one of the strongest local-SEO ranking signals.
 */
class NAPProfile {
  constructor(overrides = {}) {
    this.profile = {
      name:           'Telzon Academy',
      alternateName:  'Telzon Digital Marketing Academy',
      phone:          '+91-9307189776',
      phoneFormatted: '+91 9307189776',
      whatsapp:       '+919307189776',
      email:          'connect@telzonacademy.in',
      website:        'https://telzonacademy.in',
      streetAddress:  'Nagpur, Maharashtra',
      addressLine2:   '',
      city:           'Nagpur',
      state:          'Maharashtra',
      pincode:        '440001',
      country:        'India',
      countryCode:    'IN',
      latitude:       21.1458,
      longitude:      79.0882,
      foundingYear:   2022,
      categoryPrimary: 'Digital Marketing Institute',
      categories: [
        'Digital Marketing Institute',
        'Training Center',
        'Educational Services',
        'Coaching Institute',
        'Online Course Provider',
      ],
      keywords: [
        'digital marketing course nagpur',
        'SEO training nagpur',
        'social media marketing course',
        'google ads course',
        'meta ads training',
      ],
      shortDescription:  'Nagpur\'s top digital marketing institute with practical training, live projects and 95% placement.',
      mediumDescription: 'Telzon Academy is Nagpur\'s leading digital marketing training institute. We train students, working professionals and business owners in SEO, Google Ads, social media marketing, content marketing and analytics through practical project-based courses with 95% placement assistance and free demo classes.',
      longDescription:   'Telzon Academy is a premier digital marketing institute based in Nagpur, Maharashtra. Founded in 2022, we offer comprehensive training in SEO, Google Ads, Meta (Facebook & Instagram) Ads, social media marketing, content marketing, email marketing, and AI-powered marketing tools. Our curriculum is built around live projects with real businesses, taught by industry-certified trainers with 8+ years of hands-on experience. We provide 95% placement assistance, free demo classes, and both weekend and weekday batches.',
      hours: {
        monday:    { open: '09:00', close: '20:00' },
        tuesday:   { open: '09:00', close: '20:00' },
        wednesday: { open: '09:00', close: '20:00' },
        thursday:  { open: '09:00', close: '20:00' },
        friday:    { open: '09:00', close: '20:00' },
        saturday:  { open: '09:00', close: '20:00' },
        sunday:    null,
      },
      social: {
        instagram: 'https://www.instagram.com/telzonacademy/',
        facebook:  '',
        linkedin:  '',
        youtube:   '',
        twitter:   '',
      },
      priceRange: '₹₹',
      currency:   'INR',
      logo:       'https://horizons-cdn.hostinger.com/79c8a858-426e-4a5e-be6a-862835a41c7c/e2680f0d45ebb3c1bcf9e8d8f6fa7d69.jpg',
      coverImage: 'https://horizons-cdn.hostinger.com/79c8a858-426e-4a5e-be6a-862835a41c7c/e2680f0d45ebb3c1bcf9e8d8f6fa7d69.jpg',
      ...overrides,
    };
  }

  get() { return this.profile; }

  forDirectory(directoryKey) {
    const p = this.profile;
    const base = {
      name: p.name, phone: p.phone, email: p.email, website: p.website,
      description: p.mediumDescription, shortDescription: p.shortDescription,
      address: `${p.streetAddress}, ${p.city}, ${p.state} ${p.pincode}, ${p.country}`,
      city: p.city, state: p.state, pincode: p.pincode, country: p.country,
      lat: p.latitude, lng: p.longitude,
      category: p.categoryPrimary, keywords: p.keywords.join(', '),
      hours: p.hours, logo: p.logo,
    };
    const overrides = {
      justdial:   { description: p.shortDescription, category: 'Computer Training Institutes' },
      sulekha:    { category: 'Digital Marketing Courses' },
      urbanpro:   { category: 'Digital Marketing Training' },
      indiamart:  { category: 'Educational & Training Services' },
      justlearn:  { category: 'Marketing' },
      bing:       { description: p.longDescription },
      googlebusiness: { description: p.longDescription, primaryCategory: 'Training school' },
    };
    return { ...base, ...(overrides[directoryKey] || {}) };
  }
}

module.exports = { NAPProfile };
