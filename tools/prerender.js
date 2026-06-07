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

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIST = resolve(ROOT, 'dist');
const SITE = 'https://telzonacademy.in';

const NAGPUR_AREAS = [
  'Dharampeth', 'Sitabuldi', 'Ramdaspeth', 'Sadar', 'Civil Lines',
  'Pratap Nagar', 'Itwari', 'Gandhibagh', 'Wardhaman Nagar', 'Manewada',
  'Hingna', 'Amravati Road', 'Wardha Road', 'Katol Road', 'Kamptee Road',
];

const SYLLABUS = [
  { week: 'Week 1–2', topic: 'Digital Marketing Fundamentals', items: ['What is digital marketing', 'Search engine basics', 'Buyer journey & funnel', 'Setting up Google Analytics'] },
  { week: 'Week 3–5', topic: 'Search Engine Optimisation (SEO)', items: ['On-page SEO', 'Off-page & link building', 'Technical SEO audit', 'Local SEO for Nagpur businesses'] },
  { week: 'Week 6–8', topic: 'Google Ads (PPC)', items: ['Search campaigns', 'Display & remarketing', 'Shopping ads', 'Conversion tracking'] },
  { week: 'Week 9–11', topic: 'Social Media Marketing', items: ['Facebook & Instagram Ads', 'LinkedIn marketing', 'YouTube SEO & Ads', 'Organic growth strategies'] },
  { week: 'Week 12–14', topic: 'Content & Email Marketing', items: ['Blog writing & SEO content', 'Email automation', 'WhatsApp marketing', 'Video content scripts'] },
  { week: 'Week 15–16', topic: 'Live Projects & Placement', items: ['2 live client campaigns', 'Portfolio building', 'Resume & LinkedIn', 'Mock interviews'] },
];

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
function rewriteHead(html, { title, description, canonical, ogTitle, ogDescription }) {
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
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:site_name" content="Telzon Academy" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(ogTitle || title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(ogDescription || description)}" />`,
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

  const syllabusHtml = SYLLABUS.map(m => `
      <li>
        <strong>${escapeHtml(m.week)} — ${escapeHtml(m.topic)}:</strong>
        ${escapeHtml(m.items.join(', '))}.
      </li>`).join('');

  const areasHtml = NAGPUR_AREAS.map(a => `<li>${escapeHtml(keywordShort)} — ${escapeHtml(a)}, Nagpur</li>`).join('\n        ');

  return `    <header>
      <h1>${escapeHtml(page.headline)}</h1>
      <p>${escapeHtml(page.subheadline || '')}</p>
      <p>${escapeHtml(page.metaDescription || '')}</p>
    </header>
    <section>
      <h2>Why students choose Telzon Academy for ${escapeHtml(keywordShort)}</h2>
      <ul>
        ${bulletsHtml}
      </ul>
      <p>Telzon Academy is Nagpur's top-rated digital marketing institute with 1,000+ students trained, 95% placement assistance and a 4.9/5 rating from 200+ student reviews. Our course fees range from ₹25,000 to ₹45,000 with no-cost EMI options and merit-based scholarships. Programs run 3 to 6 months across weekday, weekend and fully online batches — pick whichever fits your schedule.</p>
    </section>
    <section>
      <h2>What you'll learn (16-week curriculum)</h2>
      <ol>${syllabusHtml}
      </ol>
      <p>Every module ends with a graded assignment and a real campaign you can show in interviews. The course includes Google Ads, Google Analytics and Meta Blueprint certification preparation, access to all premium tools during training, and 1 year of placement assistance after course completion.</p>
    </section>
    <section>
      <h2>${escapeHtml(keywordShort)} — accessible from every part of Nagpur</h2>
      <p>Our centre is centrally located in Nagpur and easy to reach from every major area. We also run live online batches with the same trainers and curriculum.</p>
      <ul>
        ${areasHtml}
      </ul>
    </section>
    <section>
      <h2>Frequently Asked Questions about ${escapeHtml(keywordShort)} in Nagpur</h2>${faqsHtml}
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
      <p>Telzon Academy offers a 16-week practical digital marketing course with 95% placement assistance, live client projects, and Google Ads, Google Analytics and Meta Blueprint certification preparation. Course fees range from ₹25,000 to ₹45,000 with no-cost EMI options and merit-based scholarships. We run weekday morning, weekday evening and weekend batches — plus a fully online live batch for students outside Nagpur. Call <a href="tel:+919307189776">+91-9307189776</a> or email <a href="mailto:connect@telzonacademy.in">connect@telzonacademy.in</a> to book a free demo class.</p>
    </section>`;
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

async function writeRoute(baseHtml, outRelative, { title, description, canonical, ogTitle, ogDescription, content }) {
  const head = rewriteHead(baseHtml, { title, description, canonical, ogTitle, ogDescription });
  const full = rewriteRoot(head, content);
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
      canonical: `${SITE}/pages/${page.slug}`,
      ogTitle: page.ogTitle,
      ogDescription: page.ogDescription,
      content: landingPageContent(page),
    });
    count++;
  }

  // 2) /blog
  await writeRoute(baseHtml, 'blog/index.html', {
    title: 'Digital Marketing Blog & Resources | Telzon Academy Nagpur',
    description: 'Read the latest articles, guides, and insights on digital marketing trends, SEO, social media, and more from Telzon Academy in Nagpur.',
    canonical: `${SITE}/blog`,
    content: blogContent(),
  });
  count++;

  // 3) /lead-generation-package (also aliased to /free-demo at runtime)
  await writeRoute(baseHtml, 'lead-generation-package/index.html', {
    title: 'Lead Generation Package for Nagpur Businesses | Telzon Academy',
    description: 'Telzon Academy lead generation package for Nagpur businesses — Meta Ads, Google Ads, landing page and WhatsApp funnel handled end-to-end. Book a free strategy call.',
    canonical: `${SITE}/lead-generation-package`,
    content: leadGenContent(),
  });
  count++;

  console.log(`[prerender] wrote ${count} static HTML files under dist/`);
}

main().catch(err => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});
