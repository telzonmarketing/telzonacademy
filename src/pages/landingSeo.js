// Shared SEO data + builders for landing pages.
// Pure JS (no JSX/React) so it can be imported by both LandingPage.jsx and the
// build-time prerenderer (tools/prerender.mjs). Single source of truth → no drift.

export const NAGPUR_AREAS = [
  'Dharampeth','Sitabuldi','Ramdaspeth','Sadar','Civil Lines',
  'Pratap Nagar','Itwari','Gandhibagh','Wardhaman Nagar','Manewada',
  'Hingna','Amravati Road','Wardha Road','Katol Road','Kamptee Road'
];

export const PAGE_FAQS = {
  default: [
    { q: 'What is the duration of the digital marketing course in Nagpur?', a: 'The course runs from 3 to 6 months depending on the batch you choose. We offer a 3-month intensive and a 6-month comprehensive program with weekend and weekday options.' },
    { q: 'What are the fees for the digital marketing course at Telzon Academy?', a: 'Course fees range from ₹25,000 to ₹45,000 depending on the program. We offer flexible EMI options and merit-based scholarships. Contact us for the latest pricing.' },
    { q: 'Do I need prior experience to join the digital marketing course in Nagpur?', a: 'No prior experience is needed. Our course starts from absolute basics and moves to advanced topics. Students from any background — science, commerce, arts — have successfully completed this course.' },
    { q: 'Is there placement assistance after the digital marketing course?', a: 'Yes. Telzon Academy has a 95% placement success rate. We help with resume building, LinkedIn optimisation, mock interviews and direct connections with hiring partners in Nagpur and across India.' },
    { q: 'Which areas in Nagpur is Telzon Academy accessible from?', a: 'Our institute is centrally located in Nagpur and easily reachable from Dharampeth, Sitabuldi, Sadar, Ramdaspeth, Civil Lines, Pratap Nagar and all other major areas. We also offer fully online classes.' },
    { q: 'Will I get Google and Meta certification?', a: 'Yes. Our trainers guide you through the Google Ads, Google Analytics, and Meta Blueprint certification exams. These industry certifications are included in the course.' },
  ],
  'digital-marketing-course-fees-in-nagpur': [
    { q: 'How much does a digital marketing course cost in Nagpur?', a: 'At Telzon Academy, fees range from ₹25,000 to ₹45,000. This is an all-inclusive fee — no hidden charges for study materials, tools or certification guidance.' },
    { q: 'Is EMI available for the digital marketing course fees?', a: 'Yes. We offer 3-month and 6-month no-cost EMI options. You can start the course with a small registration amount and pay the rest in easy instalments.' },
    { q: 'Are there any scholarships or discounts available?', a: 'We offer merit-based scholarships of up to 30% for students who perform well in our admission test. Early-bird discounts are also available for the next batch.' },
    { q: 'What is included in the course fee?', a: 'The fee includes all study materials, live project access, tool subscriptions during training, certification exam prep, and 1 year of placement assistance. No extra charges.' },
    { q: 'How does Telzon Academy\'s fee compare to other institutes in Nagpur?', a: 'Most institutes in Nagpur charge ₹15,000–₹20,000 for basic courses with no live projects. Telzon Academy charges a premium because we include live projects, Google/Meta certification and 95% placement support.' },
    { q: 'Can I get a refund if I am not satisfied?', a: 'We offer a free demo class before you enroll so you can experience the quality first. After enrollment, we have a structured refund policy within the first 7 days.' },
  ],
  'digital-marketing-course-with-placement-nagpur': [
    { q: 'What is Telzon Academy\'s placement record?', a: 'We have a 95% placement success rate. Our graduates work at companies like Swiggy, OLA, Nykaa, and dozens of Nagpur-based agencies and startups.' },
    { q: 'How long does placement take after course completion?', a: 'Most students receive their first job offer within 30–60 days of course completion. Our placement team actively connects you with hiring partners throughout the course.' },
    { q: 'What kind of jobs do digital marketing course graduates get in Nagpur?', a: 'Common roles include Digital Marketing Executive, SEO Analyst, Social Media Manager, Google Ads Specialist, Content Marketer and Performance Marketing Manager. Salaries range from ₹2.5 LPA to ₹8.5 LPA.' },
    { q: 'Does Telzon Academy have a job guarantee?', a: 'We provide 100% placement assistance, not a guaranteed job. However, our 95% placement rate means almost every student who completes the course and projects gets placed within 60 days.' },
    { q: 'Can I get a freelancing career after the digital marketing course?', a: 'Absolutely. Many of our graduates work as freelancers earning ₹30,000–₹1,00,000 per month. We teach you how to find clients and set up your own digital marketing consultancy.' },
    { q: 'What companies hire from Telzon Academy?', a: 'Our graduates have been hired by Swiggy, OLA, Le Meridien, Amul, Nykaa, and many Nagpur-based digital agencies. We also partner with startups looking for freshers.' },
  ],
  'seo-course-in-nagpur': [
    { q: 'What will I learn in the SEO course in Nagpur?', a: 'You will learn keyword research, on-page optimisation, technical SEO audits, link building, local SEO, Google Search Console, and how to rank websites on Google — all with live practice.' },
    { q: 'Is SEO still worth learning in 2026?', a: 'Absolutely. SEO generates the highest ROI of any digital marketing channel. Every business in Nagpur needs SEO and good SEO professionals are in very high demand, earning ₹3–8 LPA.' },
    { q: 'How long does it take to learn SEO?', a: 'Our SEO module takes 3–4 weeks of intensive training. To get good at it professionally, plan 3–6 months of consistent practice, which is why we include live projects.' },
    { q: 'Will I work on a real website in the SEO course?', a: 'Yes. You will work on live websites — including your own practice site — and do real audits of existing websites during the course. No theoretical-only learning.' },
    { q: 'Does the SEO course include local SEO for Nagpur businesses?', a: 'Yes. We have a dedicated local SEO module covering Google Business Profile, Nagpur-specific citation building, local keyword targeting and map pack optimisation.' },
    { q: 'What tools are covered in the SEO course?', a: 'Google Search Console, Google Analytics, Semrush, Ahrefs (basic), Screaming Frog, Moz, Ubersuggest and Google PageSpeed Insights. All tools are available during training.' },
  ],
  'digital-marketing-agency-in-nagpur': [
    { q: 'What does Telzon Academy as a digital marketing agency in Nagpur do?', a: 'We run end-to-end digital marketing for Nagpur businesses — SEO, Google Ads, Meta Ads, social media management, content creation, and lead generation. We also offer website design and conversion-rate optimisation.' },
    { q: 'How much do digital marketing agency services in Nagpur cost?', a: 'Monthly retainers start at ₹15,000/month for SEO-only and go up to ₹75,000/month for full-stack growth packages. Pricing is transparent and based on scope, never on guesswork.' },
    { q: 'Is Telzon Academy actually based in Nagpur?', a: 'Yes — our team, trainers and account managers are all based in Nagpur. You can walk in for a meeting any time. We work with both local Nagpur businesses and clients across India.' },
    { q: 'Do you handle Google Ads and Meta Ads for Nagpur businesses?', a: 'Yes. Our certified team manages Google Search, Display, Performance Max, and Meta (Facebook + Instagram) ad campaigns with full transparency, weekly reporting and ROI tracking.' },
    { q: 'How long until I see results from your digital marketing services?', a: 'Paid ads usually start delivering leads within the first week. SEO results kick in around 2–3 months, with major ranking gains by month 4–6. We share progress every 2 weeks.' },
    { q: 'Can I get a free consultation before signing up?', a: 'Yes. Book a free 30-minute strategy call. We\'ll audit your current digital presence and give you 2–3 specific recommendations whether you sign up or not.' },
  ],
  'top-10-digital-marketing-institutes-in-nagpur': [
    { q: 'Who ranks #1 among digital marketing institutes in Nagpur?', a: 'Based on student reviews (4.9/5 from 200+), placement rate (95%), course quality and AI-powered curriculum, Telzon Academy ranks #1 on most independent rankings of digital marketing institutes in Nagpur.' },
    { q: 'How is this top 10 list determined?', a: 'We score each institute on: placement record, curriculum depth, trainer expertise, student reviews on Google, fee transparency and live project work. The full methodology is shared on this page.' },
    { q: 'Are these rankings updated for 2026?', a: 'Yes. This list is reviewed and updated quarterly to reflect latest course offerings, placement records and student reviews from Nagpur.' },
    { q: 'How do I choose the right institute from this list?', a: 'Take a free demo class at the top 2–3 institutes that match your budget and timing. Compare the trainer quality, curriculum and student energy before deciding.' },
    { q: 'Are online digital marketing institutes also included?', a: 'We include institutes that offer online + offline hybrid options for Nagpur students. Pure online-only national platforms are listed separately.' },
    { q: 'What\'s the average fee across the top 10?', a: 'Course fees in the top 10 range from ₹15,000 (basic) to ₹70,000 (premium with placement). Telzon Academy is in the mid-range at ₹25,000–₹45,000 with full placement support.' },
  ],
  'digital-marketing-course-in-dharampeth-nagpur': [
    { q: 'Where exactly is Telzon Academy located relative to Dharampeth?', a: 'Telzon Academy is centrally located in Nagpur, easy to reach from Dharampeth. The commute from Variety Square or Wing Square is roughly 10–15 minutes by auto or your own vehicle.' },
    { q: 'Are there any digital marketing institutes inside Dharampeth itself?', a: 'There are a few smaller coaching centres inside Dharampeth, but most lack live projects and placement support. Most serious students from Dharampeth join Telzon Academy for the full curriculum and placement track record.' },
    { q: 'Can I attend the course online if I\'m based in Dharampeth?', a: 'Yes. We offer fully online live batches with the same syllabus and trainers. Many Dharampeth working professionals choose the online option to save commute time.' },
    { q: 'What batch timings work best for Dharampeth working professionals?', a: 'Most Dharampeth working professionals prefer the evening (6–8 PM) or weekend batch (Sat–Sun 10 AM–2 PM). Both batches have the same content and trainers.' },
    { q: 'Is parking available at the institute?', a: 'Yes. We have parking for two-wheelers and cars at the institute, so coming from Dharampeth by your own vehicle is no problem.' },
    { q: 'Can I take a free demo class first?', a: 'Absolutely. We run free demo classes every Saturday. WhatsApp us your name to confirm a slot — no commitment required.' },
  ],
  'digital-marketing-jobs-in-nagpur': [
    { q: 'What digital marketing jobs are available in Nagpur right now?', a: 'Common openings in Nagpur include Digital Marketing Executive, SEO Analyst, Social Media Manager, Performance Marketing Manager, Content Writer and Google Ads Specialist. Salaries range from ₹2.5L to ₹12L+ depending on experience.' },
    { q: 'What is the entry-level digital marketing salary in Nagpur?', a: 'Fresher digital marketing salaries in Nagpur range from ₹2.5–₹3.5 LPA in 2026. With Google + Meta certifications and a portfolio, freshers can negotiate ₹4 LPA.' },
    { q: 'Which companies hire digital marketers in Nagpur?', a: 'Major hirers include Persistent Systems, Tata Consultancy Services, dozens of Nagpur-based agencies, ed-tech companies, real estate firms and D2C brands. Telzon also has a hiring partner network of 50+ companies.' },
    { q: 'How fast can I get a digital marketing job after the course?', a: 'On average, our students get placed within 30–60 days of course completion. 95% are placed within 90 days, provided they complete the course and project work.' },
    { q: 'Can I work as a freelancer instead of taking a job?', a: 'Yes. Many Telzon graduates freelance for ₹40,000–₹1,00,000+ per month. We teach freelancing, client acquisition and pricing in a dedicated module.' },
    { q: 'Are there remote digital marketing jobs available from Nagpur?', a: 'Yes. Remote roles are increasingly common — many Nagpur-based marketers work for Mumbai, Bangalore and overseas clients while staying in Nagpur. We help you craft a remote-friendly portfolio.' },
  ],
  'online-digital-marketing-course-nagpur': [
    { q: 'Is the online digital marketing course at Telzon Academy live or recorded?', a: 'It is live instructor-led training over Zoom/Google Meet. You attend real-time classes, ask questions, and get assignments. Recorded sessions are also available if you miss a class.' },
    { q: 'Is the online course as good as the offline one?', a: 'Yes — same curriculum, same trainers, same live projects. The only difference is you attend from home. Many of our top-placed students completed the course fully online.' },
    { q: 'What equipment do I need for the online digital marketing course?', a: 'A laptop or desktop with a good internet connection is all you need. A smartphone is useful for social media modules. No special equipment required.' },
    { q: 'Are there any batch timings for the online course?', a: 'We offer morning batches (10 AM–12 PM), evening batches (6 PM–8 PM), and weekend batches (Sat–Sun 10 AM–2 PM). You can choose based on your schedule.' },
    { q: 'Will I get a certificate for completing the online course?', a: 'Yes, the same Telzon Academy certificate is awarded for online completion as for offline. It includes your name, the course details and is signed by our directors.' },
    { q: 'Can I switch from online to offline during the course?', a: 'Yes. If you want to attend some sessions offline, you are welcome to come to our Nagpur centre. We are flexible — online, offline, or hybrid.' },
  ],
};

const ORG = {
  name: 'Telzon Academy',
  url: 'https://telzonacademy.in',
  telephone: '+91-9307189776',
  email: 'connect@telzonacademy.in',
};
const OG_IMAGE = 'https://images.unsplash.com/photo-1695133139074-d0ab15d6d7da';

/**
 * Build canonical URL, the FAQ set, and the 4 JSON-LD schemas for a landing page.
 * MUST stay identical to what <LandingPage> renders — both import this.
 */
export function buildLandingSeo(page) {
  const canonicalUrl = `https://telzonacademy.in/pages/${page.slug}`;
  const faqs = PAGE_FAQS[page.slug] || PAGE_FAQS.default;

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: page.metaTitle,
    description: page.metaDescription,
    url: canonicalUrl,
    provider: {
      '@type': 'EducationalOrganization',
      name: ORG.name,
      url: ORG.url,
      telephone: ORG.telephone,
      email: ORG.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Nagpur',
        addressLocality: 'Nagpur',
        addressRegion: 'Maharashtra',
        postalCode: '440001',
        addressCountry: 'IN',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        bestRating: '5',
        worstRating: '1',
        ratingCount: '200',
        reviewCount: '200',
      },
    },
    courseMode: ['onsite', 'online'],
    educationalLevel: 'beginner',
    inLanguage: 'en',
    availableLanguage: ['English', 'Hindi', 'Marathi'],
    timeRequired: 'P3M',
    offers: {
      '@type': 'Offer',
      price: '25000',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      validFrom: '2026-01-01',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: '25000',
        maxPrice: '45000',
        priceCurrency: 'INR',
      },
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'blended',
      location: {
        '@type': 'Place',
        name: 'Telzon Academy',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Nagpur',
          addressRegion: 'Maharashtra',
          addressCountry: 'IN',
        },
      },
      startDate: '2026-06-01',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://telzonacademy.in' },
      { '@type': 'ListItem', position: 2, name: 'Courses', item: 'https://telzonacademy.in/pages/digital-marketing-course-in-nagpur' },
      { '@type': 'ListItem', position: 3, name: page.headline, item: canonicalUrl },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    name: ORG.name,
    description: page.metaDescription,
    url: ORG.url,
    telephone: ORG.telephone,
    email: ORG.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Nagpur, Maharashtra',
      addressLocality: 'Nagpur',
      addressRegion: 'Maharashtra',
      postalCode: '440001',
      addressCountry: 'IN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 21.1458, longitude: 79.0882 },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '20:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '09:00', closes: '18:00' },
    ],
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', bestRating: '5', ratingCount: '200' },
    sameAs: ['https://www.instagram.com/telzonacademy/'],
    areaServed: NAGPUR_AREAS.map(area => ({ '@type': 'Place', name: `${area}, Nagpur` })),
    hasMap: 'https://maps.google.com/?q=Telzon+Academy+Nagpur',
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, Credit Card, Online Transfer, EMI',
  };

  return {
    canonicalUrl,
    faqs,
    ogImage: OG_IMAGE,
    robots: 'index, follow, max-snippet:-1, max-image-preview:large',
    schemas: { courseSchema, breadcrumbSchema, faqSchema, localBusinessSchema },
  };
}

// ── Prerender helpers (used only by tools/prerender.mjs; harmless in the bundle) ──
function esc(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Full <head> markup (title, meta, canonical, OG, Twitter, JSON-LD) for a page. */
export function renderHeadTags(page) {
  const seo = buildLandingSeo(page);
  const { canonicalUrl, ogImage, robots, schemas } = seo;
  const ld = Object.values(schemas)
    .map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join('\n    ');
  return [
    `<title>${esc(page.metaTitle)}</title>`,
    `<meta name="description" content="${esc(page.metaDescription)}" />`,
    page.metaKeywords ? `<meta name="keywords" content="${esc(page.metaKeywords)}" />` : '',
    `<meta name="robots" content="${robots}" />`,
    `<link rel="canonical" href="${canonicalUrl}" />`,
    `<meta property="og:title" content="${esc(page.ogTitle)}" />`,
    `<meta property="og:description" content="${esc(page.ogDescription)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${canonicalUrl}" />`,
    `<meta property="og:image" content="${ogImage}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:site_name" content="Telzon Academy" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(page.ogTitle)}" />`,
    `<meta name="twitter:description" content="${esc(page.ogDescription)}" />`,
    `<meta name="twitter:image" content="${ogImage}" />`,
    `    ${ld}`,
  ].filter(Boolean).join('\n    ');
}

/** Static, crawlable body content placed inside #root so non-JS crawlers (GPTBot,
 *  ClaudeBot, PerplexityBot) read real per-page content. React hydrates over it. */
export function renderStaticBody(page) {
  const seo = buildLandingSeo(page);
  const bullets = (page.bullets || []).map(b => `<li>${esc(b)}</li>`).join('');
  const faqs = seo.faqs.map(f => `<div><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></div>`).join('');
  return [
    `<main>`,
    `<h1>${esc(page.headline)}</h1>`,
    `<p>${esc(page.subheadline || page.metaDescription)}</p>`,
    bullets ? `<ul>${bullets}</ul>` : '',
    `<section><h2>Frequently Asked Questions</h2>${faqs}</section>`,
    `<p>Telzon Academy — Digital Marketing Institute in Nagpur. Call ${ORG.telephone} or email ${ORG.email}.</p>`,
    `</main>`,
  ].filter(Boolean).join('\n');
}
