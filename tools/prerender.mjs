#!/usr/bin/env node
/**
 * Post-build prerenderer for Telzon Academy landing pages.
 *
 * Problem it solves: the site is a client-side React SPA, so crawlers that don't
 * execute JS (GPTBot/ChatGPT, ClaudeBot, PerplexityBot, and others) receive the
 * same generic index.html for all 61 landing pages — identical title, meta,
 * canonical, and schema. This kills both classic SEO differentiation and AEO.
 *
 * This script generates dist/pages/<slug>.html for each landing page with:
 *   - unique <title>, meta description, canonical, OG/Twitter tags
 *   - the 4 per-page JSON-LD schemas (Course, FAQPage, LocalBusiness, Breadcrumb)
 *   - crawlable static body content (H1, intro, bullets, FAQ Q&A) inside #root
 * React still hydrates over #root for human visitors (the entry bundle is in <head>).
 *
 * Routing: .htaccess serves /pages/<slug> from <slug>.html before the SPA fallback,
 * preserving the exact canonical URL (no trailing-slash redirect).
 *
 * Runs as part of `npm run build` (vite build && node tools/prerender.mjs).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { landingPages } from '../src/pages/landingPagesConfig.js';
import { renderHeadTags, renderStaticBody } from '../src/pages/landingSeo.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const TEMPLATE = path.join(DIST, 'index.html');

function removeTag(html, re) {
  return html.replace(re, '');
}

/** Replace the inner HTML of <div id="root" ...> using brace-counted div matching. */
function replaceRootInner(html, newInner) {
  const openIdx = html.indexOf('<div id="root"');
  if (openIdx === -1) throw new Error('#root not found in template');
  const openTagEnd = html.indexOf('>', openIdx) + 1;

  // Walk forward counting <div ... > and </div> to find the matching close.
  let depth = 1;
  let i = openTagEnd;
  const re = /<div\b|<\/div>/gi;
  re.lastIndex = openTagEnd;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (m[0].toLowerCase() === '</div>') {
      depth--;
      if (depth === 0) { i = m.index; break; }
    } else {
      depth++;
    }
  }
  if (depth !== 0) throw new Error('Could not find matching </div> for #root');
  return html.slice(0, openTagEnd) + '\n' + newInner + '\n  ' + html.slice(i);
}

function buildPageHtml(template, page) {
  let html = template;
  // Strip template's title, default description, and the homepage JSON-LD blocks
  html = removeTag(html, /<title>[\s\S]*?<\/title>\s*/i);
  html = removeTag(html, /<meta\s+name="description"[^>]*>\s*/i);
  html = removeTag(html, /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi);
  // Inject per-page head tags just before </head>
  html = html.replace('</head>', `    ${renderHeadTags(page)}\n  </head>`);
  // Replace #root fallback with crawlable per-page content
  html = replaceRootInner(html, renderStaticBody(page));
  return html;
}

function generateLlmsTxt() {
  const lines = [
    '# Telzon Academy — Digital Marketing Institute in Nagpur',
    '',
    '> Practical, placement-focused digital marketing training in Nagpur: SEO, Google Ads,',
    '> social media, content & analytics with live projects and 95% placement support.',
    '',
    '## Pages',
    '',
  ];
  for (const p of landingPages) {
    lines.push(`- [${p.metaTitle}](https://telzonacademy.in/pages/${p.slug}): ${p.metaDescription}`);
  }
  lines.push('');
  return lines.join('\n');
}

function main() {
  if (!fs.existsSync(TEMPLATE)) {
    console.error('dist/index.html not found — run `vite build` first.');
    process.exit(1);
  }
  const template = fs.readFileSync(TEMPLATE, 'utf8');
  const outDir = path.join(DIST, 'pages');
  fs.mkdirSync(outDir, { recursive: true });

  let ok = 0;
  for (const page of landingPages) {
    try {
      const html = buildPageHtml(template, page);
      fs.writeFileSync(path.join(outDir, `${page.slug}.html`), html);
      ok++;
    } catch (e) {
      console.error(`  ✗ ${page.slug}: ${e.message}`);
    }
  }

  // Regenerate llms.txt with unique per-page descriptions (was identical for all)
  const llms = generateLlmsTxt();
  fs.writeFileSync(path.join(DIST, 'llms.txt'), llms);
  // Also write to public/ so the committed source is correct (deploy copies public→dist)
  fs.writeFileSync(path.join(ROOT, 'public', 'llms.txt'), llms);

  console.log(`✓ Prerendered ${ok}/${landingPages.length} landing pages → dist/pages/*.html`);
  console.log(`✓ Regenerated llms.txt with ${landingPages.length} unique page descriptions`);
}

main();
