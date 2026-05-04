#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { landingPages } from '../src/pages/landingPagesConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const SITE_URL = (process.env.SITE_URL || 'https://telzonacademy.in').replace(/\/$/, '');
const REPORT_DIR = path.join(ROOT, 'seo-reports');
const REPORT_JSON = path.join(REPORT_DIR, 'seo-brain-report.json');
const REPORT_MD = path.join(REPORT_DIR, 'seo-brain-report.md');

const CORE_PUBLIC_PATHS = ['/', '/blog', '/lead-generation-package'];
const REQUIRED_ADMIN_BLOCKS = [
  '/admin',
  '/admin/blogs',
  '/admin/seo',
  '/private-free-demo-leads-94f7c1a2d3',
  '/seo-settings-dashboard-telzon-secret-2024',
];

function readText(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function ensureReportDir() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

function normalizePath(urlOrPath) {
  try {
    const parsed = new URL(urlOrPath, SITE_URL);
    return parsed.pathname === '' ? '/' : parsed.pathname;
  } catch {
    return urlOrPath;
  }
}

function extractSitemapUrls(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map(match => match[1].trim());
}

function keywordFromSlug(slug) {
  return slug
    .replace(/-/g, ' ')
    .replace(/\bnagpur\b/g, '')
    .replace(/\bin\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function countWords(text = '') {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function addIssue(issues, severity, area, message, fix, url = null) {
  issues.push({ severity, area, message, fix, url });
}

function auditLandingPages(issues) {
  const titleMap = new Map();
  const descMap = new Map();
  const slugSet = new Set();

  for (const page of landingPages) {
    const url = `${SITE_URL}/pages/${page.slug}`;
    const metaTitle = page.metaTitle || '';
    const metaDescription = page.metaDescription || '';
    const headline = page.headline || '';
    const keyword = keywordFromSlug(page.slug);

    if (slugSet.has(page.slug)) {
      addIssue(issues, 'critical', 'Landing Pages', `Duplicate landing page slug: ${page.slug}`, 'Keep one unique slug per landing page.', url);
    }
    slugSet.add(page.slug);

    if (metaTitle.length < 45 || metaTitle.length > 70) {
      addIssue(issues, 'warning', 'Meta Title', `${page.slug} title is ${metaTitle.length} characters.`, 'Keep SEO titles around 45-70 characters with the primary keyword and brand.', url);
    }

    if (metaDescription.length < 120 || metaDescription.length > 165) {
      addIssue(issues, 'warning', 'Meta Description', `${page.slug} description is ${metaDescription.length} characters.`, 'Keep meta descriptions around 120-165 characters with a benefit and soft CTA.', url);
    }

    if (!metaTitle.toLowerCase().includes('telzon')) {
      addIssue(issues, 'warning', 'Branding', `${page.slug} title does not include Telzon.`, 'Add Telzon Academy to reinforce brand queries.', url);
    }

    if (keyword && !`${metaTitle} ${metaDescription} ${headline}`.toLowerCase().includes(keyword.split(' ')[0])) {
      addIssue(issues, 'info', 'Keyword Match', `${page.slug} may not clearly target "${keyword}".`, 'Make sure the primary keyword appears naturally in title, description, and H1.', url);
    }

    if (!Array.isArray(page.bullets) || page.bullets.length < 3) {
      addIssue(issues, 'warning', 'Content Depth', `${page.slug} has fewer than 3 benefit bullets.`, 'Add practical, keyword-relevant benefits for stronger conversion and topical relevance.', url);
    }

    if (countWords(page.subheadline) < 10) {
      addIssue(issues, 'info', 'Content Depth', `${page.slug} subheadline is short.`, 'Use a richer subheadline that mentions audience, outcome, and training mode.', url);
    }

    titleMap.set(metaTitle, [...(titleMap.get(metaTitle) || []), page.slug]);
    descMap.set(metaDescription, [...(descMap.get(metaDescription) || []), page.slug]);
  }

  for (const [title, slugs] of titleMap.entries()) {
    if (title && slugs.length > 1) {
      addIssue(issues, 'critical', 'Duplicate Titles', `Duplicate meta title used by ${slugs.join(', ')}.`, 'Write unique meta titles for every landing page.');
    }
  }

  for (const [description, slugs] of descMap.entries()) {
    if (description && slugs.length > 1) {
      addIssue(issues, 'critical', 'Duplicate Descriptions', `Duplicate meta description used by ${slugs.join(', ')}.`, 'Write unique meta descriptions for every landing page.');
    }
  }
}

function auditSitemapAndRobots(issues) {
  const sitemap = readText('public/sitemap.xml');
  const robots = readText('public/robots.txt');
  const urls = extractSitemapUrls(sitemap);
  const sitemapPaths = new Set(urls.map(normalizePath));
  const expectedPaths = [
    ...CORE_PUBLIC_PATHS,
    ...landingPages.map(page => `/pages/${page.slug}`),
  ];

  for (const expectedPath of expectedPaths) {
    if (!sitemapPaths.has(expectedPath)) {
      addIssue(issues, 'critical', 'Sitemap Coverage', `${expectedPath} is missing from sitemap.xml.`, 'Add the URL to public/sitemap.xml and the sitemap generator workflow.', `${SITE_URL}${expectedPath}`);
    }
  }

  for (const url of urls) {
    const currentPath = normalizePath(url);
    if (REQUIRED_ADMIN_BLOCKS.some(blocked => currentPath.startsWith(blocked))) {
      addIssue(issues, 'critical', 'Sitemap Hygiene', `${currentPath} is an admin/private URL in sitemap.xml.`, 'Remove admin and private URLs from the sitemap.', url);
    }
  }

  for (const blockedPath of REQUIRED_ADMIN_BLOCKS) {
    if (!robots.includes(`Disallow: ${blockedPath}`)) {
      addIssue(issues, 'warning', 'Robots', `${blockedPath} is not explicitly disallowed in robots.txt.`, 'Add a Disallow line for the private/admin route.');
    }
  }

  if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) {
    addIssue(issues, 'critical', 'Robots', 'robots.txt does not point to the canonical sitemap URL.', `Add: Sitemap: ${SITE_URL}/sitemap.xml`);
  }

  return urls;
}

function auditSourceSeo(issues) {
  const landingPageSource = readText('src/pages/LandingPage.jsx');
  const globalSeoSource = readText('src/components/GlobalSeo.jsx');
  const appSource = readText('src/App.jsx');

  const landingRequired = [
    '<link rel="canonical"',
    'property="og:title"',
    'name="twitter:card"',
    'application/ld+json',
    'FAQPage',
    'Course',
    'LocalBusiness',
  ];

  for (const token of landingRequired) {
    if (!landingPageSource.includes(token)) {
      addIssue(issues, 'critical', 'Rendered SEO', `Landing pages are missing ${token}.`, 'Restore this SEO tag/schema in LandingPage.jsx.');
    }
  }

  const homeRequired = [
    '<link rel="canonical"',
    'property="og:title"',
    'name="twitter:card"',
    'EducationalOrganization',
    'OfferCatalog',
  ];

  for (const token of homeRequired) {
    if (!globalSeoSource.includes(token)) {
      addIssue(issues, 'critical', 'Homepage SEO', `Homepage SEO is missing ${token}.`, 'Restore this SEO tag/schema in GlobalSeo.jsx.');
    }
  }

  if (!appSource.includes('<TrackingScripts />')) {
    addIssue(issues, 'warning', 'Tracking', 'Global tracking injector is not mounted.', 'Mount TrackingScripts inside App so saved Google/Pixel snippets load.');
  }
}

async function fetchWithTimeout(url, timeoutMs = 20000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const started = Date.now();

  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TelzonSeoBrain/1.0; +https://telzonacademy.in)',
      },
    });
    const text = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      finalUrl: response.url,
      ms: Date.now() - started,
      bytes: Buffer.byteLength(text),
      text,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function crawlUrls(urls, issues) {
  if (process.env.SKIP_LIVE_CRAWL === 'true') {
    return [];
  }

  const uniqueUrls = [...new Set(urls)];
  const results = [];

  for (const url of uniqueUrls) {
    try {
      const result = await fetchWithTimeout(url);
      results.push({ url, ...result, text: undefined });

      if (!result.ok) {
        addIssue(issues, 'critical', 'Live Crawl', `${url} returned HTTP ${result.status}.`, 'Fix the route, hosting rewrite, or server response.', url);
      }

      if (result.ms > 3000) {
        addIssue(issues, 'warning', 'Performance', `${url} responded in ${result.ms}ms.`, 'Investigate hosting, bundle size, image weight, and caching.', url);
      }

      if (result.bytes < 1000) {
        addIssue(issues, 'warning', 'Live Crawl', `${url} returned a very small response (${result.bytes} bytes).`, 'Check that the deployed app is serving the expected page shell.', url);
      }
    } catch (error) {
      results.push({ url, ok: false, status: 0, ms: null, bytes: 0, error: error.message });
      addIssue(issues, 'critical', 'Live Crawl', `${url} could not be crawled: ${error.message}`, 'Check DNS, SSL, hosting availability, and firewall rules.', url);
    }
  }

  return results;
}

function scoreFromIssues(issues) {
  const penalty = issues.reduce((total, issue) => {
    if (issue.severity === 'critical') return total + 12;
    if (issue.severity === 'warning') return total + 5;
    return total + 1;
  }, 0);
  return Math.max(0, 100 - penalty);
}

function summarizeIssues(issues) {
  return {
    critical: issues.filter(issue => issue.severity === 'critical').length,
    warning: issues.filter(issue => issue.severity === 'warning').length,
    info: issues.filter(issue => issue.severity === 'info').length,
  };
}

function writeReports(report) {
  ensureReportDir();
  fs.writeFileSync(REPORT_JSON, `${JSON.stringify(report, null, 2)}\n`);

  const lines = [
    '# Telzon SEO Brain Report',
    '',
    `Generated: ${report.generatedAt}`,
    `Site: ${report.siteUrl}`,
    `Score: ${report.score}/100`,
    '',
    '## Summary',
    '',
    `- Critical: ${report.summary.critical}`,
    `- Warning: ${report.summary.warning}`,
    `- Info: ${report.summary.info}`,
    `- Landing pages audited: ${report.landingPageCount}`,
    `- Live URLs crawled: ${report.crawl.length}`,
    '',
    '## Issues',
    '',
  ];

  if (report.issues.length === 0) {
    lines.push('No issues found.');
  } else {
    for (const issue of report.issues) {
      lines.push(`- **${issue.severity.toUpperCase()}** ${issue.area}: ${issue.message}`);
      lines.push(`  Fix: ${issue.fix}`);
      if (issue.url) lines.push(`  URL: ${issue.url}`);
    }
  }

  lines.push('', '## Crawl Results', '');
  for (const result of report.crawl) {
    lines.push(`- ${result.status || 'ERR'} ${result.ms ?? '-'}ms ${result.bytes} bytes ${result.url}`);
    if (result.error) lines.push(`  Error: ${result.error}`);
  }

  fs.writeFileSync(REPORT_MD, `${lines.join('\n')}\n`);
}

async function main() {
  const issues = [];

  auditLandingPages(issues);
  const sitemapUrls = auditSitemapAndRobots(issues);
  auditSourceSeo(issues);
  const crawl = await crawlUrls(sitemapUrls, issues);

  const report = {
    generatedAt: new Date().toISOString(),
    siteUrl: SITE_URL,
    score: scoreFromIssues(issues),
    summary: summarizeIssues(issues),
    landingPageCount: landingPages.length,
    issues,
    crawl,
  };

  writeReports(report);

  console.log(`SEO Brain score: ${report.score}/100`);
  console.log(`Critical: ${report.summary.critical}, Warning: ${report.summary.warning}, Info: ${report.summary.info}`);
  console.log(`Reports written to ${path.relative(ROOT, REPORT_MD)} and ${path.relative(ROOT, REPORT_JSON)}`);

  if (process.env.FAIL_ON_CRITICAL === 'true' && report.summary.critical > 0) {
    process.exit(1);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
