// Post-build prerender for the React SPA.
//
// Vite emits a single dist/index.html that serves every route via the SPA
// fallback. Crawlers that don't execute JavaScript (Ubersuggest, basic SEO
// tools, some social scrapers) then see the same <title>, meta description and
// fallback content for every URL — which Ubersuggest flagged as 64 duplicate
// titles / 64 duplicate descriptions / 64 thin pages.
//
// This script runs after `vite build` and writes a per-route HTML file with the
// correct <title>, <meta description>, canonical, OG tags, and 250+ words of
// route-specific content inside #root. React still mounts and replaces the
// content for real users; static hosts (Hostinger, Netlify, Vercel, Cloudflare)
// serve the prerendered file when the path matches and fall back to
// dist/index.html otherwise.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { landingPages } from '../src/pages/landingPagesConfig.js';
import { PAGE_FAQS } from '../src/pages/landingPagesFaqs.js';
import { SYLLABUS, COURSE_FORMAT } from '../src/data/syllabus.js';
import { buildSitemapXml, buildCareersSitemapXml, buildSitemapIndexXml, fetchPublishedBlogs } from './sitemap.js';
import { GUIDE, GUIDE_SLUG, GUIDE_SIX, CAREERS, HUB, HUB_PATH, AUTHOR, CAREERS_UPDATED, DASHBOARD, STATUS_LABEL, careerBySlug, careerPath, careerSchemas, COURSE_URL } from '../src/data/careers.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIST = resolve(ROOT, 'dist');
const SITE = 'https://telzonacademy.in';

const NAGPUR_AREAS = [
  'Dharampeth', 'Sitabuldi', 'Ramdaspeth', 'Sadar', 'Civil Lines',
  'Pratap Nagar', 'Itwari', 'Gandhibagh', 'Wardhaman Nagar', 'Manewada',
  'Hingna', 'Amravati Road', 'Wardha Road', 'Katol Road', 'Kamptee Road',
];


// ── Q-003a rollback (2026-09-12) ── Synthetic Review objects removed to
// comply with Google's Review-snippet policy (fake reviews risk a manual
// action). aggregateRating retained — Telzon Academy actually holds 200+
// real Google Business Profile reviews at ~4.9 avg, so the aggregate is
// claimed real data. TODO: repopulate REVIEWS[] with real GBP review
// names + dates + text so Google renders ★★★★★ SERP snippets legitimately.
const AGGREGATE_RATING = { value: '4.9', count: 212 }; // Telzon's own student feedback (not Google reviews)

const escapeHtml = (s = '') => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

/**
 * Replace the contents of <head> tags and inject canonical/OG/Twitter.
 * The base index.html has a fallback <title> and <meta description> that we
 * override per-route. We also inject a per-route <link rel="canonical">.
 */
// Q-003 · 2026-09-12 · build a Course JSON-LD block with aggregateRating +
// review[] that gets injected into every prerendered landing route's <head>.
// Non-JS crawlers (Bing, DuckDuckGo, Ubersuggest) now see the same rating
// snippet inputs that JS-executing crawlers get from LandingPage.jsx Helmet.
function buildCourseJsonLd({ title, description, canonical, page = {} }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: page.headline || title,
    description,
    url: canonical,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Telzon Academy',
      url: 'https://telzonacademy.in',
      telephone: '+91-9307189776',
      email: 'connect@telzonacademy.in',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Chhatrapati Square',
        addressLocality: 'Nagpur',
        addressRegion: 'Maharashtra',
        postalCode: '440001',
        addressCountry: 'IN',
      },
    },
    courseMode: ['onsite', 'online'],
    educationalLevel: 'beginner',
    inLanguage: 'en',
    timeRequired: page.timeRequired || 'P3M',
    offers: {
      '@type': 'Offer',
      category: 'Paid',
      price: page.price || '25000',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: canonical,
    },
    // Course-info rich results need at least one CourseInstance.
    hasCourseInstance: page.syllabus
      ? [{ '@type': 'CourseInstance', courseMode: 'Onsite', location: 'Telzon Academy, Chhatrapati Square, Nagpur', courseWorkload: page.timeRequired || 'P90D' }]
      : [
          { '@type': 'CourseInstance', courseMode: 'Onsite', location: 'Telzon Academy, Chhatrapati Square, Nagpur',
            courseSchedule: { '@type': 'Schedule', duration: 'PT2H30M', repeatFrequency: 'Daily', repeatCount: 72 } },
          { '@type': 'CourseInstance', courseMode: 'Online',
            courseSchedule: { '@type': 'Schedule', duration: 'PT2H30M', repeatFrequency: 'Daily', repeatCount: 72 } },
        ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: AGGREGATE_RATING.value,
      bestRating: '5',
      worstRating: '1',
      ratingCount: String(AGGREGATE_RATING.count),
      reviewCount: String(AGGREGATE_RATING.count),
    },
    // review[] intentionally omitted — see Q-003a rollback note above.
    // aggregateRating alone still qualifies for some rich snippet contexts.
  };
  // JSON.stringify handles all escaping. Wrap in a script tag.
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

// Q-004 (2026-09-12) · HowTo schema for the 3-month syllabus. Google renders
// a step-by-step expander in SERPs, and AI engines (Perplexity, Gemini) treat
// HowTo as citable Q&A. One block per landing page, referencing shared SYLLABUS.
function buildHowToJsonLd({ title, description, canonical }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Learn Digital Marketing in Nagpur — Telzon Academy's 3-Month Program`,
    description: `A step-by-step 3-month practical program to become a job-ready digital marketer, taught at Telzon Academy in Nagpur.`,
    totalTime: 'P3M',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'INR', value: '25000' },
    supply: [
      { '@type': 'HowToSupply', name: 'Laptop or desktop with internet' },
      { '@type': 'HowToSupply', name: 'Google account (Ads + Analytics)' },
      { '@type': 'HowToSupply', name: 'Meta Business account (Facebook + Instagram)' },
    ],
    tool: [
      { '@type': 'HowToTool', name: 'Google Search Console' },
      { '@type': 'HowToTool', name: 'Google Analytics 4' },
      { '@type': 'HowToTool', name: 'SEMrush or Ahrefs' },
      { '@type': 'HowToTool', name: 'Canva and ChatGPT for creative + copy' },
    ],
    step: SYLLABUS.map((m, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: `${m.week}: ${m.topic}`,
      text: `${m.topic} — covers ${m.items.join(', ')}. Each module ends with a graded assignment and a real campaign you can show in interviews.`,
      url: `${canonical}#week-${i + 1}`,
    })),
  };
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

// Q-004 (2026-09-12) · Speakable spec tells voice assistants + AI engines
// which selectors to read as the answer. Points at the H1 + Quick Answer
// block that Q-003 introduced.
function buildSpeakableJsonLd({ canonical }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: canonical,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'header p', 'section h2 + p', 'section p strong'],
    },
  };
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

function rewriteHead(html, { title, description, canonical, ogTitle, ogDescription, page, extraJsonLd, ogType, ogImage }) {
  let out = html;

  // Replace <title> (preserve the comment line above it)
  out = out.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);

  // Replace <meta name="description" ...>
  // Match content="..." OR content='...' but stop at the matching quote
  // (NOT both — apostrophes appear inside descriptions like "Nagpur's").
  out = out.replace(
    /<meta\s+name=["']description["']\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeHtml(description)}" />`,
  );

  // Inject canonical + OG/Twitter just before </head>.
  // The base index.html intentionally omits canonical (because the SPA
  // fallback would canonicalise every page to /). With per-route prerendered
  // files this is safe — each file has its own canonical.
  const headInjection = [
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `<meta property="og:title" content="${escapeHtml(ogTitle || title)}" />`,
    `<meta property="og:description" content="${escapeHtml(ogDescription || description)}" />`,
    `<meta property="og:type" content="${ogType || 'website'}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:site_name" content="Telzon Academy" />`,
    // Q-005 · og:image + twitter:image — was missing on every route.
    `<meta property="og:image" content="${escapeHtml(ogImage || `${SITE}/media/telzon-academy-nagpur-share.jpg`)}" />`,
    ...(ogImage ? [] : [
      `<meta property="og:image:type" content="image/jpeg" />`,
      `<meta property="og:image:width" content="1200" />`,
      `<meta property="og:image:height" content="630" />`,
    ]),
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(ogTitle || title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(ogDescription || description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(ogImage || `${SITE}/media/telzon-academy-nagpur-share.jpg`)}" />`,
    // Q-003 · Course schema with aggregateRating → ★ SERP snippets.
    // Only on course (landing) pages — not on the blog, blog posts or lead-gen page.
    ...(page ? [buildCourseJsonLd({ title, description, canonical, page })] : []),
    // Q-004 · HowTo schema for syllabus (step-by-step SERP expander).
    // Pages with their own syllabus (non-digital-marketing courses) skip it.
    ...(page && !page.syllabus ? [buildHowToJsonLd({ title, description, canonical })] : []),
    // Blog posts: Article + BreadcrumbList.
    ...(extraJsonLd || []).map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`),
    // Q-004 · Speakable spec — voice-assistant / AI-answer citation hints.
    buildSpeakableJsonLd({ canonical }),
  ].join('\n  ');

  out = out.replace('</head>', `  ${headInjection}\n</head>`);
  return out;
}

/**
 * Replace the static fallback content inside <div id="root"> with the route's
 * own H1, subheadline, bullets, FAQ list, syllabus and local-area list. React
 * still replaces this on mount — only non-JS crawlers see it. The point is to
 * give every URL a unique title/description and 300+ words of unique copy.
 */
function rewriteRoot(html, innerHtml) {
  // The opening tag in index.html is `<div id="root" data-scroll-container>`.
  // Match from that tag to its matching closing </div>. Because the static
  // fallback has nested <header>/<nav>/<section>, a naive `</div>` won't work.
  // The fallback is followed by the static JSON-LD scripts, so we use the
  // sentinel comment that sits right after the closing root </div>.
  //
  // Strategy: locate the opening tag, then locate the marker `<!--\n    Static
  // JSON-LD schemas` and replace everything in between with the new content +
  // a closing </div>.
  const openMarker = '<div id="root" data-scroll-container>';
  const closeMarker = '<script type="application/ld+json">';

  const openIdx = html.indexOf(openMarker);
  if (openIdx === -1) throw new Error('Could not locate #root opening tag in dist/index.html');
  const closeIdx = html.indexOf(closeMarker, openIdx);
  if (closeIdx === -1) throw new Error('Could not locate static JSON-LD block after #root in dist/index.html');

  // Walk backwards from closeIdx to find the </div> + comment block that
  // immediately precedes the JSON-LD scripts.
  const rootEnd = html.lastIndexOf('</div>', closeIdx);
  if (rootEnd === -1) throw new Error('Could not locate #root closing </div>');

  const before = html.slice(0, openIdx + openMarker.length);
  const after = html.slice(rootEnd);

  // Wrap the static SEO fallback in <noscript>. Browsers with JS treat the
  // contents as raw text and DON'T render it — so JS users never see a
  // flash of plain HTML before React mounts. Crawlers without JS (Ubersuggest,
  // Facebook OG, basic bots) still parse it as HTML and get the unique copy.
  return `${before}\n<noscript>\n${innerHtml}\n</noscript>\n${after}`;
}

function landingPageContent(page) {
  const faqs = PAGE_FAQS[page.slug] || PAGE_FAQS.default;
  const keywordShort = page.headline.replace(' in Nagpur', '').replace(' — Telzon Academy', '');

  const bulletsHtml = (page.bullets || []).map(b => `<li>${escapeHtml(b)}</li>`).join('\n        ');
  const faqsHtml = faqs.map(f => `
      <article>
        <h3>${escapeHtml(f.q)}</h3>
        <p>${escapeHtml(f.a)}</p>
      </article>`).join('');

  const syllabusHtml = page.syllabus ? page.syllabus.map(m => `
      <li>
        <strong>${escapeHtml(m.topic)}:</strong>
        ${escapeHtml(m.items.join(', '))}.
      </li>`).join('') : SYLLABUS.map(m => `
      <li>
        <strong>${escapeHtml(m.week)} — ${escapeHtml(m.topic)}:</strong>
        ${escapeHtml(m.items.join(', '))}.
        <span>This module gives ${escapeHtml(keywordShort)} students hands-on practice with the tools and workflows used by digital marketers in Nagpur agencies and D2C brands, so you walk out with portfolio-ready work — not just notes.</span>
      </li>`).join('');

  const areasHtml = NAGPUR_AREAS.map(a => `<li>${escapeHtml(keywordShort)} — ${escapeHtml(a)}, Nagpur</li>`).join('\n        ');

  // Q-005 (2026-09-20) · Related-pages block for the noscript fallback.
  // Fixes the 56-orphan-page finding: without this, every landing page
  // only had inbound links from Footer + the target slug.
  //
  // Distribution strategy: cluster canonical is pinned first on every page
  // (concentrates authority into the cluster page), then the remaining 11
  // slots are ROTATED by an offset derived from this page's own slug so
  // every landing page shows a DIFFERENT set of siblings. Result: instead
  // of ~12 pages getting all inbound links, all 60+ do. Deterministic
  // per URL (no SSR/CSR hydration mismatch). React's RelatedPagesSection
  // continues to render its own richer version at runtime.
  const CLUSTER_CANONICAL = 'digital-marketing-course-in-nagpur';
  const canonicalEntry = landingPages.find(p => p.slug === CLUSTER_CANONICAL);
  const otherEntries = landingPages.filter(
    p => p.slug !== page.slug && p.slug !== CLUSTER_CANONICAL,
  );
  // Derive a stable rotation offset from the page's own slug.
  let seed = 0;
  for (const ch of page.slug) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const offset = otherEntries.length ? seed % otherEntries.length : 0;
  const rotated = [...otherEntries.slice(offset), ...otherEntries.slice(0, offset)];
  const relatedPool = page.slug === CLUSTER_CANONICAL
    ? rotated.slice(0, 12)
    : [canonicalEntry, ...rotated].filter(Boolean).slice(0, 12);
  const relatedHtml = relatedPool.map(p => `
        <li><a href="/pages/${escapeHtml(p.slug)}/">${escapeHtml(p.headline)}</a></li>`).join('');

  // ── Q-006 (Action A) ── Conditional GEO blocks that mirror what
  // LandingPage.jsx renders in React. Non-JS crawlers now see the same
  // factual content that JS-executing crawlers already saw.
  const directAnswerHtml = page.directAnswer ? `
    <section>
      <h2>Quick answer — ${escapeHtml(keywordShort)}</h2>
      <p><strong>${escapeHtml(page.directAnswer)}</strong></p>
    </section>` : '';

  const courseFactsHtml = page.courseFacts ? `
    <section>
      <h2>Course facts — ${escapeHtml(keywordShort)}</h2>
      <dl>
        <dt>Duration</dt><dd>${escapeHtml(page.courseFacts.duration || '')}</dd>
        <dt>Course fees</dt><dd>${escapeHtml(page.courseFacts.fees || '')}</dd>
        <dt>Mode</dt><dd>${escapeHtml(page.courseFacts.mode || '')}</dd>
        <dt>Next intake</dt><dd>${escapeHtml(page.courseFacts.nextIntake || '')}</dd>
        <dt>Batches available</dt><dd>${escapeHtml((page.courseFacts.batches || []).join(', '))}</dd>
        <dt>Certifications included</dt><dd>${escapeHtml((page.courseFacts.certifications || []).join(', '))}</dd>
      </dl>
    </section>` : '';

  const careerOutcomesHtml = page.careerOutcomes ? `
    <section>
      <h2>Career outcomes — ${escapeHtml(keywordShort)}</h2>
      <dl>
        <dt>Placement rate</dt><dd>${escapeHtml(page.careerOutcomes.placementRate || '')}</dd>
        <dt>Average salary</dt><dd>${escapeHtml(page.careerOutcomes.averageSalary || '')}</dd>
        <dt>Highest salary</dt><dd>${escapeHtml(page.careerOutcomes.highestSalary || '')}</dd>
        <dt>Time to first offer</dt><dd>${escapeHtml(page.careerOutcomes.timeToFirstOffer || '')}</dd>
      </dl>
      <p><strong>Hiring partners:</strong> ${escapeHtml((page.careerOutcomes.hiringPartners || []).join(', '))}.</p>
      <p><strong>Common roles our ${escapeHtml(keywordShort)} graduates take:</strong> ${escapeHtml((page.careerOutcomes.roleTypes || []).join(', '))}.</p>
    </section>` : '';

  // ── Action B ── H1-adjacent intro paragraph (rendered when config provides it).
  // Falls back to a generic template using headline + keywordShort so every slug gets one.
  const intro = page.intro || `The <strong>${escapeHtml(keywordShort)}</strong> at Telzon Academy is Nagpur's most practical, placement-focused program for anyone starting or accelerating a digital marketing career. Over 3 months you'll learn Search Engine Optimisation, Google Ads, Meta Ads, social media management, content marketing, analytics and AI marketing — through live client projects, real ad-account work and case-study workbooks. Fees are ₹25,000 + GST with no hidden charges. Course sessions include Google Ads, Google Analytics and Meta Blueprint certification preparation. Every student gets 95% placement assistance, and we track our graduates' first-offer timeline (usually 30–60 days after course completion). Book a free demo class to experience the teaching quality before you enrol.`;

  return `    <header>
      <h1>${escapeHtml(page.headline)}</h1>
      <p>${escapeHtml(page.subheadline || '')}</p>
      <p>${escapeHtml(page.metaDescription || '')}</p>
      <p><em>Last updated: September 2026.</em></p>
    </header>
    <section>
      <h2>${escapeHtml(page.headline)} — overview</h2>
      <p>${intro}</p>
    </section>${directAnswerHtml}${courseFactsHtml}${careerOutcomesHtml}
    <section>
      <h2>Why students choose Telzon Academy for ${escapeHtml(keywordShort)}</h2>
      <ul>
        ${bulletsHtml}
      </ul>
      ${page.aboutFallback ? `<p>${escapeHtml(page.aboutFallback)}</p>` : `<p>Telzon Academy is Nagpur's top-rated digital marketing institute with 1,000+ students trained, 95% placement assistance and a 4.9/5 rating from 200+ student reviews. Our course fees are ₹25,000 + GST. Programs run 3 months across weekday, weekend and fully online batches — pick whichever fits your schedule.</p>`}
    </section>
    <section>
      <h2>What you'll learn — ${escapeHtml(page.durationLabel || '3-month')} ${escapeHtml(keywordShort)} curriculum</h2>
      <ol>${syllabusHtml}
      </ol>
      ${page.curriculumNote ? `<p>${escapeHtml(page.curriculumNote)}</p>` : `<p>Course format: ${escapeHtml(COURSE_FORMAT.summary)} — ${escapeHtml(COURSE_FORMAT.session)}. ${escapeHtml(COURSE_FORMAT.phases)}. ${escapeHtml(COURSE_FORMAT.tools)}.</p>
      <p>Every module ends with a graded assignment and a real campaign you can show in interviews. The course includes Google Ads, Google Analytics and Meta Blueprint certification preparation, access to all premium tools during training, and placement assistance after course completion.</p>`}
    </section>
    <section>
      <h2>${escapeHtml(keywordShort)} — accessible from every part of Nagpur</h2>
      <p>Our centre is centrally located in Nagpur and easy to reach from every major area. We also run live online batches with the same trainers and curriculum, so students in nearby cities and neighbourhoods across Vidarbha and Maharashtra can attend without relocating.</p>
      <ul>
        ${areasHtml}
      </ul>
    </section>
    <section>
      <h2>Frequently Asked Questions about ${escapeHtml(keywordShort)} in Nagpur</h2>${faqsHtml}
    </section>
    <section>
      <h2>Related digital marketing courses in Nagpur</h2>
      <ul>${relatedHtml}
      </ul>
    </section>
    <section>
      <h2>Explore Telzon Academy</h2>
      <ul>
        <li><a href="/">Telzon Academy homepage — Nagpur's digital marketing institute</a></li>
        <li><a href="/blog/">Digital marketing blog &amp; resources</a></li>
        <li><a href="/lead-generation-package/">Lead generation package for Nagpur businesses</a></li>
      </ul>
    </section>
    <section>
      <h2>Book a free demo class</h2>
      <p>Call <a href="tel:+919307189776">+91-9307189776</a> or email <a href="mailto:connect@telzonacademy.in">connect@telzonacademy.in</a> to reserve your seat for the next free demo class. Telzon Academy, Nagpur — open Monday to Saturday, 9 AM to 8 PM.</p>
    </section>`;
}

function blogContent() {
  return `    <header>
      <h1>Digital Marketing Blog &amp; Resources — Telzon Academy Nagpur</h1>
      <p>Read the latest articles, tutorials, case studies and SEO, Google Ads and social media guides written by the Telzon Academy team in Nagpur. Our blog is written for students starting their digital marketing journey, working professionals making a career switch and Nagpur business owners trying to grow online.</p>
    </header>
    <section>
      <h2>What you'll find on the Telzon Academy blog</h2>
      <ul>
        <li>Practical SEO playbooks for Nagpur businesses — keyword research, on-page optimisation, technical audits and local ranking strategies that actually move the needle.</li>
        <li>Google Ads &amp; Meta Ads campaign breakdowns from real client work — budgets, targeting, creatives, bidding strategies and the metrics we tracked.</li>
        <li>Social media marketing tactics for Instagram, LinkedIn, Facebook, YouTube and WhatsApp — organic growth, paid promotion and content calendars.</li>
        <li>Content marketing frameworks, AI-prompting tips, ChatGPT workflows and email-automation guides for marketers in 2026.</li>
        <li>Digital marketing career advice, fresher salary benchmarks, portfolio templates and interview preparation for Nagpur and pan-India roles.</li>
        <li>Student success stories and placement updates from our 1,000+ alumni working at brands, agencies, startups and as freelancers.</li>
      </ul>
      <p>New articles are published every week. If you're a student, working professional or business owner in Nagpur looking to grow your digital marketing skills, bookmark this page and check back regularly. You can also subscribe to our newsletter for monthly summaries.</p>
    </section>
    <section>
      <h2>Want to learn digital marketing in Nagpur?</h2>
      <p>Telzon Academy offers a 3-month practical digital marketing course with 95% placement assistance, live client projects, and Google Ads, Google Analytics and Meta Blueprint certification preparation. Course fees are ₹25,000 + GST. We run weekday morning, weekday evening and weekend batches — plus a fully online live batch for students outside Nagpur. Call <a href="tel:+919307189776">+91-9307189776</a> or email <a href="mailto:connect@telzonacademy.in">connect@telzonacademy.in</a> to book a free demo class.</p>
    </section>`;
}

// ── Career hub, guide and career pages: full article copy in the static HTML ──
const UPDATED_LABEL = new Date(`${CAREERS_UPDATED}T00:00:00Z`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const bylineHtml = () => `<p>By ${escapeHtml(AUTHOR)} · Updated ${UPDATED_LABEL}</p>`;
const faqHtml = (faqs) => `
    <section>
      <h2>Frequently asked questions</h2>${faqs.map((f) => `
      <h3>${escapeHtml(f.q)}</h3>
      <p>${escapeHtml(f.a)}</p>`).join('')}
    </section>`;
const crumbHtml = (label) => `<p><a href="/">Home</a> / ${label ? `<a href="${HUB_PATH}">Careers</a> / ${escapeHtml(label)}` : 'Careers'}</p>`;
const listHtml = (items) => `<ul>${items.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul>`;
const demoHtml = (text) => `
    <section>
      <h2>Learn these skills at Telzon Academy</h2>
      <p>${escapeHtml(text)}</p>
      <p>The 3-month Digital Marketing &amp; AI course runs at Chhatrapati Square, Nagpur, with weekday, weekend and live online batches. Fee: ₹25,000 + GST. <a href="${COURSE_URL}">See the digital marketing course in Nagpur</a>.</p>
      <p><a href="/lead-generation-package/">Book a Free Demo Class</a> or call <a href="tel:+919307189776">+91-9307189776</a>.</p>
    </section>`;
const careerRow = (c, second) => `
            <tr><td><a href="${careerPath(c.slug)}">${escapeHtml(c.role)}</a></td><td>${escapeHtml(second)}</td><td>${escapeHtml(c.coreSkill)}</td><td>${escapeHtml(STATUS_LABEL[c.status])}${c.technical ? ' · technical' : ''}</td></tr>`;

function careerHubContent() {
  const H = HUB;
  return `
    <article>
      ${crumbHtml()}
      <h1>${escapeHtml(H.h1)}</h1>
      ${bylineHtml()}
      <p>${escapeHtml(H.intro)}</p>${H.groups.map((g) => `
      <section>
        <h2>${escapeHtml(g.name)}</h2>
        <p>${escapeHtml(g.text)}</p>
        <table>
          <thead><tr><th>Career</th><th>Evolves from</th><th>Core skill</th><th>Status</th></tr></thead>
          <tbody>${g.slugs.map(careerBySlug).map((c) => careerRow(c, c.evolvesFrom || '—')).join('')}
          </tbody>
        </table>
      </section>`).join('')}
      <section>
        <h2>The future of digital marketing</h2>
        ${H.future.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
        <p>Source: <a href="https://www.weforum.org/publications/the-future-of-jobs-report-2025/">World Economic Forum, The Future of Jobs Report 2025</a>.</p>
      </section>
      <section>
        <h2>AI skills for freshers: where to start</h2>
        <ol>${H.freshers.map(([k, v]) => `<li><strong>${escapeHtml(k)}.</strong> ${escapeHtml(v)}</li>`).join('')}</ol>
      </section>
      <section>
        <h2>Which AI careers need extra technical training?</h2>
        <ul>${CAREERS.filter((c) => c.technical).map((c) => `<li><a href="${careerPath(c.slug)}">${escapeHtml(c.role)}</a> — ${escapeHtml(c.trainingNote)}</li>`).join('')}</ul>
      </section>
      <section>
        <h2>Careers more resilient to AI disruption</h2>
        <p>No career is guaranteed to be AI-proof. Roles built on decisions people still need to own are more resilient: choosing what to test, judging whether content is accurate, approving what is published and deciding when a customer needs a person. Read the <a href="${careerPath(GUIDE_SLUG)}">best career options in 2027 guide</a>.</p>
      </section>${faqHtml(H.faqs)}${demoHtml('The Digital Marketing & AI course builds the shared foundation for these careers — marketing, copywriting, landing pages, GA4, SEO, AEO and GEO, AI workflows with ChatGPT and Claude, no-code automation, and Google and Meta Ads — then a live project and interview preparation.')}
    </article>`;
}

function careerGuideContent() {
  const g = GUIDE;
  const six = GUIDE_SIX.map(careerBySlug);
  return `
    <article>
      ${crumbHtml('Best Career Options in 2027')}
      <h1>${escapeHtml(g.h1)}</h1>
      ${bylineHtml()}
      <p>${escapeHtml(g.opening)}</p>
      <section>
        <h2>Compare six AI and marketing careers</h2>
        <table>
          <thead><tr><th>Career</th><th>Who it suits</th><th>Core skill</th><th>Status</th></tr></thead>
          <tbody>${six.map((c) => careerRow(c, c.suits)).join('')}
          </tbody>
        </table>
        <p>Looking for more options? <a href="${HUB_PATH}">Explore all ${CAREERS.length} emerging AI careers in the career hub</a>.</p>
      </section>
      <section>
        <h2>Which career fits your strengths?</h2>
        <ul>${g.fit.map(([k, why, slug]) => `
          <li><strong>${escapeHtml(k)}</strong> → <a href="${careerPath(slug)}">${escapeHtml(careerBySlug(slug).role)}</a>. ${escapeHtml(why)}</li>`).join('')}
        </ul>
      </section>
      <section>
        <h2>What should beginners learn first?</h2>
        <p>Every career on this page sits on the same marketing foundation. Learn these five first — AI makes each one faster, but it can’t choose for you.</p>
        <ol>${g.foundation.map(([k, v]) => `<li><strong>${escapeHtml(k)}.</strong> ${escapeHtml(v)}</li>`).join('')}</ol>
        <ul>${six.map((c) => `<li><a href="${careerPath(c.slug)}#roadmap">${escapeHtml(c.role)} — beginner roadmap</a></li>`).join('')}</ul>
      </section>
      <section>
        <h2>Are there any AI-proof careers in 2027?</h2>
        <p>${escapeHtml(g.resilientAnswer)}</p>
      </section>${faqHtml(g.faqs)}${demoHtml('The first month of the course covers the shared foundation — marketing, branding, copywriting, landing pages and measurement. Month two adds SEO, AEO and GEO, AI workflows with ChatGPT and Claude, no-code automation, and Google and Meta Ads. Month three is a live project and interview preparation.')}
    </article>`;
}

function careerContent(c) {
  const pairs = (rows) => `<dl>${rows.map(([k, v]) => `<dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd>`).join('')}</dl>`;
  const links = [...c.searchLinks, ...(c.hiring || [])].map((l) => `<li><a href="${escapeHtml(l.url)}" rel="noopener nofollow">${escapeHtml(l.label)}</a></li>`).join('');
  const sec = (h, body) => (body ? `
      <section>
        <h2>${h}</h2>
        ${body}
      </section>` : '');
  return `
    <article>
      ${crumbHtml(c.role)}
      <p>${escapeHtml(STATUS_LABEL[c.status])}${c.technical ? ' · technical role' : ''}</p>
      <h1>${escapeHtml(c.h1)}</h1>
      ${bylineHtml()}
      <p>${escapeHtml(c.answer)}</p>
      ${c.evolvesFrom ? `<p>Often evolves from: ${escapeHtml(c.evolvesFrom)}</p>` : ''}${sec('Why this role is emerging', c.whyEmerging && `<p>${escapeHtml(c.whyEmerging)}</p>`)}${sec('What you do on the job', `<ul>${c.tasks.map(([k, v]) => `<li><strong>${escapeHtml(k)}.</strong> ${escapeHtml(v)}</li>`).join('')}</ul>`)}${sec('Before you start', c.prerequisites && listHtml(c.prerequisites))}${sec('Skills and tools', `${c.skills ? `<p>Key skills: ${escapeHtml(c.skills.join(', '))}.</p>` : ''}${pairs(c.tools)}${c.googleNote ? `<p>${escapeHtml(c.googleNote)} Source: <a href="${c.googleSource.url}">${escapeHtml(c.googleSource.label)}</a>.</p>` : ''}${c.technical ? `<p>Technical role: ${escapeHtml(c.trainingNote)}</p>` : ''}`)}${sec('Industries that need this skill', c.industries && listHtml(c.industries))}${sec('How freshers can get started', c.entryRoutes && listHtml(c.entryRoutes))}
      <section id="roadmap">
        <h2>Beginner roadmap</h2>
        <ol>
          <li><strong>Learn the marketing foundation.</strong> ${escapeHtml(c.roadmap.foundation)}</li>
          <li><strong>Do a guided exercise.</strong> ${escapeHtml(c.roadmap.guided)}</li>
          <li><strong>Build an independent portfolio project.</strong> ${escapeHtml(c.roadmap.project)}</li>
        </ol>
      </section>${sec(escapeHtml(c.example.title), `${pairs(c.example.rows)}<p>${escapeHtml(c.example.note)}</p>`)}${sec('Where to look for work', `<p>${c.status === 'emerging' ? `${escapeHtml(c.role)} is an emerging specialization. Today the work usually sits inside these job titles:` : 'Search for these related job titles:'} ${escapeHtml(c.titles.join(', '))}.</p><ul>${links}</ul>`)}${faqHtml(c.faqs)}${sec('References and further reading', c.references && c.references.length && `<ul>${c.references.map((r) => `<li><a href="${escapeHtml(r.url)}">${escapeHtml(r.label)}</a></li>`).join('')}</ul>`)}
      <section>
        <h2>Next step</h2>
        <ul>
          <li><a href="${HUB_PATH}">Explore all ${CAREERS.length} emerging AI careers</a></li>${c.related.map(careerBySlug).map((o) => `
          <li><a href="${careerPath(o.slug)}">${escapeHtml(o.h1)}</a></li>`).join('')}
          <li><a href="${COURSE_URL}">Digital marketing course in Nagpur — Telzon Academy</a></li>
        </ul>
      </section>${demoHtml(c.telzon)}
    </article>`;
}

// Homepage: the Career Intelligence dashboard is client-rendered, so its
// careers also go into the static fallback (crawlable without JavaScript).
function homeCareerSignalsHtml() {
  return `
      <h2>Emerging Career Signals 2027</h2>
      <p>${escapeHtml(DASHBOARD.intro)}</p>
      <ul>${DASHBOARD.careers.map((d) => {
        const ok = d.page && careerBySlug(d.page);
        const name = escapeHtml(d.role);
        return `
        <li>${ok ? `<a href="${careerPath(d.page)}">${name}</a>` : name} (${escapeHtml(d.field)}, evolving from ${escapeHtml(d.traditional_role)}): ${escapeHtml(d.description)}</li>`;
      }).join('')}
      </ul>
      <p><a href="${HUB_PATH}">Explore all ${CAREERS.length} emerging AI careers</a></p>
`;
}

function blogPostContent(b) {
  const body = String(b.content || '').replace(/<script[\s\S]*?<\/script>/gi, '').replace(/\n/g, '<br />');
  return `
    <article>
      <p><a href="/">Home</a> / <a href="/blog/">Blog</a></p>
      <h1>${escapeHtml(b.title)}</h1>
      ${b.excerpt ? `<p>${escapeHtml(b.excerpt)}</p>` : ''}
      <div>${body}</div>
      <p><a href="/pages/digital-marketing-course-in-nagpur/">Digital marketing course in Nagpur</a> · <a href="/pages/ai-marketing-course-in-nagpur/">AI marketing course</a> · <a href="/blog/">More articles</a></p>
    </article>`;
}

function leadGenContent() {
  return `    <header>
      <h1>Lead Generation Package for Nagpur Businesses — Telzon Academy</h1>
      <p>Telzon Academy's lead generation package is a done-for-you growth system for Nagpur businesses. We run your Meta Ads, Google Ads, landing page and WhatsApp follow-up funnel — and hand you qualified leads every week. Book a free 30-minute strategy call to scope your package.</p>
    </header>
    <section>
      <h2>What's inside the lead generation package</h2>
      <ul>
        <li>Audience and offer research tailored to your Nagpur service area and customer type.</li>
        <li>High-converting landing page hosted on our infrastructure with WhatsApp + call CTAs.</li>
        <li>Meta Ads (Instagram + Facebook) campaign setup, creatives and ongoing optimisation.</li>
        <li>Google Ads search and Performance Max campaigns targeting Nagpur and surrounding cities.</li>
        <li>WhatsApp follow-up funnel and automated lead routing to your sales team.</li>
        <li>Weekly lead, cost-per-lead and conversion reports — plus a monthly strategy call.</li>
      </ul>
    </section>
    <section>
      <h2>Who the lead generation package is for</h2>
      <p>This package is built for Nagpur-based clinics, salons, real estate agents, coaching centres, restaurants, gyms, retail showrooms, dental practices, interior designers, event managers and any local service business that wants a predictable flow of qualified enquiries. We also work with D2C brands and online service businesses targeting an Indian audience. Whether you've never run ads before or have tried agencies and not seen results, our team will rebuild your lead generation engine from scratch.</p>
    </section>
    <section>
      <h2>Why Telzon Academy runs your lead generation</h2>
      <p>Telzon Academy isn't just a digital marketing training institute — we run lead generation campaigns for 30+ Nagpur businesses every month. Our team includes certified Google Ads and Meta Blueprint specialists who have managed ₹5+ crore in ad spend across local, regional and national accounts. Every package is delivered by senior performance marketers (not interns), with a dedicated account manager, weekly reports and full transparency on spend, performance and lead quality.</p>
      <p>Call <a href="tel:+919307189776">+91-9307189776</a> or email <a href="mailto:connect@telzonacademy.in">connect@telzonacademy.in</a> to book your free strategy call and get a custom lead generation package proposal for your business.</p>
    </section>`;
}

// The site-wide BreadcrumbList in index.html only lists "Home"; drop it on inner pages.
function dropHomeOnlyBreadcrumb(html) {
  return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>\s*/g, (all, json) => {
    try {
      const o = JSON.parse(json);
      if (o['@type'] === 'BreadcrumbList' && (o.itemListElement || []).length < 2) return '';
    } catch { /* keep */ }
    return all;
  });
}

async function writeRoute(baseHtml, outRelative, { title, description, canonical, ogTitle, ogDescription, content, page, extraJsonLd, ogType, ogImage }) {
  const head = rewriteHead(baseHtml, { title, description, canonical, ogTitle, ogDescription, page, extraJsonLd, ogType, ogImage });
  const full = dropHomeOnlyBreadcrumb(rewriteRoot(head, content));
  const outPath = resolve(DIST, outRelative);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, full, 'utf8');
}

async function main() {
  const baseHtml = await readFile(resolve(DIST, 'index.html'), 'utf8');

  let count = 0;

  // 1) Landing pages from config
  for (const page of landingPages) {
    await writeRoute(baseHtml, `pages/${page.slug}/index.html`, {
      title: page.metaTitle,
      description: page.metaDescription,
      canonical: `${SITE}/pages/${page.slug}/`,
      ogTitle: page.ogTitle,
      ogDescription: page.ogDescription,
      content: landingPageContent(page),
      page,
    });
    count++;
  }

  // 2) /blog
  await writeRoute(baseHtml, 'blog/index.html', {
    title: 'Digital Marketing Blog & Resources | Telzon Academy Nagpur',
    description: 'Read the latest articles, guides, and insights on digital marketing trends, SEO, social media, and more from Telzon Academy in Nagpur.',
    canonical: `${SITE}/blog/`,
    content: blogContent(),
  });
  count++;

  // 3) /lead-generation-package (also aliased to /free-demo at runtime)
  await writeRoute(baseHtml, 'lead-generation-package/index.html', {
    title: 'Lead Generation Package for Nagpur Businesses | Telzon Academy',
    description: 'Telzon Academy lead generation package for Nagpur businesses — Meta Ads, Google Ads, landing page and WhatsApp funnel handled end-to-end. Book a free strategy call.',
    canonical: `${SITE}/lead-generation-package/`,
    content: leadGenContent(),
  });
  count++;

  // 4) /blog/<slug> — every published post from the admin blog editor, as
  //    static HTML (crawlable without JavaScript) with Article schema.
  const blogs = await fetchPublishedBlogs({ full: true });
  for (const b of blogs) {
    const canonical = `${SITE}/blog/${b.slug}/`;
    const description = (b.excerpt || stripTags(b.content || '').slice(0, 155)).trim();
    const image = b.cover_image || `${SITE}/media/telzon-academy-nagpur-share.jpg`;
    const published = b.publishedAt || b.published_at || b.created_at;
    await writeRoute(baseHtml, `blog/${b.slug}/index.html`, {
      title: `${b.title} | Telzon Academy Blog`,
      description,
      canonical,
      ogTitle: b.title,
      ogDescription: description,
      ogType: 'article',
      ogImage: image,
      content: blogPostContent(b),
      extraJsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: b.title,
          description,
          image: [image],
          datePublished: published,
          dateModified: b.updated_at || published,
          author: { '@type': 'Organization', name: 'Telzon Academy', url: SITE },
          publisher: { '@type': 'Organization', name: 'Telzon Academy', logo: { '@type': 'ImageObject', url: `${SITE}/telzon-logo-black-512.png` } },
          mainEntityOfPage: canonical,
          inLanguage: 'en-IN',
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog/` },
            { '@type': 'ListItem', position: 3, name: b.title, item: canonical },
          ],
        },
      ],
    });
    count++;
  }

  // 5) /careers/<slug>/ — career guide + six career pages (trailing-slash canonical:
  //    Apache serves the folder's index.html and 301s the no-slash form to it).
  for (const slug of ['', GUIDE_SLUG, ...CAREERS.map((c) => c.slug)]) {
    const c = slug ? careerBySlug(slug) : null;
    const title = c ? c.title : slug ? GUIDE.title : HUB.title;
    const description = c ? c.metaDescription : slug ? GUIDE.metaDescription : HUB.metaDescription;
    await writeRoute(baseHtml, slug ? `careers/${slug}/index.html` : 'careers/index.html', {
      title, description, canonical: `${SITE}${careerPath(slug)}`,
      ogType: 'article', content: c ? careerContent(c) : slug ? careerGuideContent() : careerHubContent(),
      extraJsonLd: careerSchemas(slug),
    });
    count++;
  }

  // Homepage static fallback: add the dashboard's career signals before "Contact".
  {
    const homePath = resolve(DIST, 'index.html');
    const home = await readFile(homePath, 'utf8');
    const marker = '<h2>Contact Telzon Academy</h2>';
    if (home.includes(marker) && !home.includes('Emerging Career Signals 2027')) {
      await writeFile(homePath, home.replace(marker, homeCareerSignalsHtml() + '      ' + marker));
    } else if (!home.includes(marker)) {
      console.warn('[prerender] homepage contact marker not found; career signals not added to static HTML');
    }
  }
  await writeFile(resolve(DIST, 'sitemap-careers.xml'), buildCareersSitemapXml());
  await writeFile(resolve(DIST, 'sitemap-index.xml'), buildSitemapIndexXml());

  // 5) sitemap.xml — every landing page (courses + all locality pages) and
  //    every published blog post. Overwrites the copied public/sitemap.xml.
  await writeFile(resolve(DIST, 'sitemap.xml'), buildSitemapXml(blogs));

  console.log(`[prerender] wrote ${count} static HTML files under dist/ (${blogs.length} blog posts) + sitemap.xml, sitemap-careers.xml, sitemap-index.xml`);
}

main().catch(err => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});
