#!/usr/bin/env node
/**
 * tools/sitemap.js — one source of truth for sitemap.xml.
 *
 * Lists the homepage, core pages, EVERY landing page in
 * src/pages/landingPagesConfig.js (courses + all locality pages) and every
 * published blog post from Supabase. Used by:
 *   - tools/prerender.js (writes dist/sitemap.xml on every deploy build)
 *   - .github/workflows/generate-sitemap.yml (weekly refresh of public/sitemap.xml)
 *
 * Run directly:  node tools/sitemap.js public/sitemap.xml
 *
 * Network failures never break the build: if Supabase can't be reached the
 * sitemap is still written, just without blog posts.
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { landingPages } from '../src/pages/landingPagesConfig.js';
import { GUIDE_SLUG, CAREERS, CAREERS_UPDATED, careerPath } from '../src/data/careers.js';

export const SITE = 'https://telzonacademy.in';

// Date the landing-page content last changed. Update it when page copy changes,
// so <lastmod> stays truthful (Google ignores lastmod that changes every build).
export const CONTENT_UPDATED = '2026-11-27';

// Public anon key — the same one shipped in the browser bundle
// (src/lib/customSupabaseClient.js). Row-level security limits it to
// published blog posts.
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://lcnfnwivodzjjpykihfn.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

export async function fetchPublishedBlogs({ full = false } = {}) {
  const key = SUPABASE_ANON_KEY || (await fallbackAnonKey());
  if (!key) return [];
  const select = full ? '*' : 'slug,updated_at,created_at';
  const url = `${SUPABASE_URL}/rest/v1/blogs?is_published=eq.true&select=${select}&order=created_at.desc`;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    const res = await fetch(url, { headers: { apikey: key, Authorization: `Bearer ${key}` }, signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) { console.warn(`[sitemap] Supabase answered ${res.status}; skipping blog posts`); return []; }
    const rows = await res.json();
    return Array.isArray(rows) ? rows.filter((b) => b && typeof b.slug === 'string' && /^[a-z0-9-]+$/i.test(b.slug)) : [];
  } catch (err) {
    console.warn(`[sitemap] could not fetch blog posts (${err.message}); skipping them`);
    return [];
  }
}

async function fallbackAnonKey() {
  try {
    const { readFile } = await import('node:fs/promises');
    const src = await readFile(new URL('../src/lib/customSupabaseClient.js', import.meta.url), 'utf8');
    const m = src.match(/VITE_SUPABASE_ANON_KEY\s*\|\|\s*'([^']+)'/);
    return m ? m[1] : '';
  } catch { return ''; }
}

const PRIORITY = {
  'digital-marketing-course-in-nagpur': '1.0',
  'digital-marketing-institute-in-nagpur': '1.0',
  'best-digital-marketing-course-in-nagpur': '1.0',
  'ai-marketing-course-in-nagpur': '0.9',
  'commercial-ads-and-photography-course-in-nagpur': '0.9',
  'digital-marketing-course-fees-in-nagpur': '0.9',
};

// Real photos + the students' live-shoot video, listed so Google Images and
// Google Videos can index them (video/image sitemap extensions).
const MEDIA_PAGES = new Set(['digital-marketing-course-in-nagpur', 'commercial-ads-and-photography-course-in-nagpur']);
const MEDIA_XML = [
  `<image:image><image:loc>${SITE}/media/telzon-students-camera-setup.webp</image:loc></image:image>`,
  `<image:image><image:loc>${SITE}/media/telzon-students-studio-lighting.webp</image:loc></image:image>`,
  `<video:video><video:thumbnail_loc>${SITE}/media/telzon-live-shoot-poster.webp</video:thumbnail_loc>`
    + '<video:title>Telzon Academy students on a live commercial shoot in Nagpur</video:title>'
    + '<video:description>Behind the scenes: Telzon Academy students light, set up and shoot a live commercial for a local café in Nagpur.</video:description>'
    + `<video:content_loc>${SITE}/media/telzon-live-shoot.mp4</video:content_loc><video:duration>29</video:duration>`
    + '<video:publication_date>2026-11-27</video:publication_date></video:video>',
].join('');

const isoDate = (d) => (d ? String(d).slice(0, 10) : CONTENT_UPDATED);
const xmlEscape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function buildSitemapXml(blogs = []) {
  const urls = [];
  const add = (path, lastmod, changefreq, priority, extra = '') =>
    urls.push(`  <url><loc>${xmlEscape(SITE + path)}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority>${extra}</url>`);

  const newestBlog = blogs.reduce((max, b) => {
    const d = isoDate(b.updated_at || b.created_at);
    return d > max ? d : max;
  }, CONTENT_UPDATED);

  add('/', CONTENT_UPDATED, 'weekly', '1.0', MEDIA_XML);
  add('/blog', newestBlog, 'daily', '0.9');
  add('/lead-generation-package', CONTENT_UPDATED, 'monthly', '0.8');

  for (const p of landingPages) {
    add(`/pages/${p.slug}`, CONTENT_UPDATED, 'monthly', PRIORITY[p.slug] || '0.8', MEDIA_PAGES.has(p.slug) ? MEDIA_XML : '');
  }
  for (const b of blogs) {
    add(`/blog/${b.slug}`, isoDate(b.updated_at || b.created_at), 'monthly', '0.7');
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.join('\n')}
</urlset>
`;
}

// Separate sitemap for the career guide + career pages (/careers/<slug>/).
// Listed in robots.txt next to sitemap.xml; submit it in Search Console too.
export function buildCareersSitemapXml() {
  const rows = [[GUIDE_SLUG, '0.9'], ...CAREERS.map((c) => [c.slug, c.status === 'listed' ? '0.8' : '0.7'])];
  const urls = rows.map(([slug, pr]) =>
    `  <url><loc>${xmlEscape(SITE + careerPath(slug))}</loc><lastmod>${CAREERS_UPDATED}</lastmod><changefreq>monthly</changefreq><priority>${pr}</priority></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

// Sitemap index pointing at both files (optional single submission in Search Console).
export function buildSitemapIndexXml() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${SITE}/sitemap.xml</loc><lastmod>${CONTENT_UPDATED}</lastmod></sitemap>
  <sitemap><loc>${SITE}/sitemap-careers.xml</loc><lastmod>${CAREERS_UPDATED}</lastmod></sitemap>
</sitemapindex>
`;
}

// CLI: node tools/sitemap.js <output path>
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const out = process.argv[2] || 'public/sitemap.xml';
  const blogs = await fetchPublishedBlogs();
  const xml = buildSitemapXml(blogs);
  await writeFile(out, xml);
  const dir = out.replace(/[^/]*$/, '');
  await writeFile(`${dir}sitemap-careers.xml`, buildCareersSitemapXml());
  await writeFile(`${dir}sitemap-index.xml`, buildSitemapIndexXml());
  console.log(`[sitemap] wrote ${out}: ${landingPages.length} landing pages, ${blogs.length} blog posts`);
}
