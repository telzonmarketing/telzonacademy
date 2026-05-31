'use strict';

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

/**
 * StructuredDataAuditor — proactively crawls the site's pages and validates
 * their JSON-LD structured data, catching exactly the class of problems Google
 * Search Console reports under "Enhancements" (e.g. "FAQ: 2 invalid items").
 *
 * It specifically detects:
 *   - DUPLICATE @type on one page (e.g. two FAQPage blocks — a static one in the
 *     shell + a per-route one from the SPA — which Google flags as invalid).
 *   - FAQ item problems: missing question name, empty/missing answer text, or
 *     disallowed HTML inside answers.
 *   - JSON-LD parse errors and blocks missing @type / required fields.
 *
 * Output: <reportsDir>/schema-audit.json — consumed by StrategyEngine so the
 * dashboard surfaces "fix N structured-data errors" as a prioritized action.
 *
 * LIMITATION: this fetches static HTML (no JS execution), so it validates the
 * server-rendered JSON-LD. It does NOT see schema a client-side SPA injects at
 * runtime — so a duplicate that only exists post-render (static block + SPA
 * block) won't be caught here. To detect those, render with a headless browser
 * before parsing (puppeteer/playwright) — a future enhancement.
 */
class StructuredDataAuditor {
  constructor(config = {}) {
    this.siteUrl = (config.siteUrl || process.env.SITE_URL || '').replace(/\/$/, '');
    this.reportsDir = config.reportsDir || 'public/seo-reports';
    this.maxPages = config.maxPages || 60;
    this.timeout = config.timeout || 15000;
    // FAQ answers may only contain this limited set of tags (Google spec).
    this.allowedFaqTags = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'ol', 'ul', 'li', 'a', 'p', 'div', 'b', 'strong', 'i', 'em']);
  }

  async run() {
    const urls = await this._discoverUrls();
    const pages = [];
    for (const url of urls.slice(0, this.maxPages)) {
      const result = await this._auditPage(url);
      if (result) pages.push(result);
    }

    const allIssues = pages.flatMap((p) => p.issues.map((i) => ({ ...i, url: p.url })));
    const byType = {};
    for (const i of allIssues) byType[i.kind] = (byType[i.kind] || 0) + 1;

    const report = {
      timestamp: new Date().toISOString(),
      siteUrl: this.siteUrl,
      pagesAudited: pages.length,
      pagesWithIssues: pages.filter((p) => p.issues.length > 0).length,
      duplicateFaqPages: pages.filter((p) => p.issues.some((i) => i.kind === 'duplicate-faqpage')).length,
      totalIssues: allIssues.length,
      issuesByKind: byType,
      examples: allIssues.slice(0, 25),
    };

    if (!fs.existsSync(this.reportsDir)) fs.mkdirSync(this.reportsDir, { recursive: true });
    fs.writeFileSync(path.join(this.reportsDir, 'schema-audit.json'), JSON.stringify(report, null, 2));
    console.log(`  ✓ Schema audit: ${report.pagesAudited} pages, ${report.totalIssues} issue(s), ${report.duplicateFaqPages} page(s) with duplicate FAQPage`);
    return report;
  }

  async _discoverUrls() {
    const urls = new Set();
    if (this.siteUrl) urls.add(this.siteUrl + '/');
    // Pull URLs from sitemap.xml when available
    try {
      const { data } = await axios.get(this.siteUrl + '/sitemap.xml', { timeout: this.timeout });
      const locs = String(data).match(/<loc>([^<]+)<\/loc>/g) || [];
      for (const l of locs) {
        const u = l.replace(/<\/?loc>/g, '').trim();
        if (u && !u.endsWith('.xml')) urls.add(u);
      }
    } catch { /* no sitemap — fall back to homepage only */ }
    return [...urls];
  }

  async _auditPage(url) {
    let html;
    try {
      const res = await axios.get(url, { timeout: this.timeout, headers: { 'User-Agent': 'TelzonSEOBot/1.0 (+schema-audit)' } });
      html = res.data;
    } catch (err) {
      return { url, issues: [{ kind: 'fetch-error', severity: 'low', message: `Could not fetch (${err.response?.status || err.code || err.message})` }] };
    }

    const $ = cheerio.load(html);
    const blocks = [];
    $('script[type="application/ld+json"]').each((_, el) => {
      const raw = $(el).html();
      try { blocks.push({ data: JSON.parse(raw) }); }
      catch (e) { blocks.push({ parseError: e.message }); }
    });

    const issues = [];
    const typeCounts = {};

    for (const b of blocks) {
      if (b.parseError) {
        issues.push({ kind: 'json-parse-error', severity: 'critical', message: `Invalid JSON-LD: ${b.parseError}` });
        continue;
      }
      // A block can be a single object or an array / @graph
      const nodes = Array.isArray(b.data) ? b.data : (b.data['@graph'] || [b.data]);
      for (const node of nodes) {
        const type = node && node['@type'];
        if (!type) { issues.push({ kind: 'missing-type', severity: 'important', message: 'JSON-LD node missing @type' }); continue; }
        const types = Array.isArray(type) ? type : [type];
        for (const t of types) typeCounts[t] = (typeCounts[t] || 0) + 1;
        if (types.includes('FAQPage')) issues.push(...this._validateFaq(node));
      }
    }

    // Duplicate same-@type blocks on one page (the classic invalid-FAQ cause)
    for (const [t, n] of Object.entries(typeCounts)) {
      if (n > 1 && ['FAQPage', 'BreadcrumbList', 'Organization', 'EducationalOrganization', 'LocalBusiness'].includes(t)) {
        issues.push({
          kind: t === 'FAQPage' ? 'duplicate-faqpage' : 'duplicate-schema',
          severity: t === 'FAQPage' ? 'critical' : 'important',
          message: `${n} ${t} blocks on one page — Google treats duplicate ${t} as invalid. Keep exactly one.`,
        });
      }
    }
    return { url, schemaTypes: Object.keys(typeCounts), issues };
  }

  _validateFaq(node) {
    const issues = [];
    const entities = Array.isArray(node.mainEntity) ? node.mainEntity : (node.mainEntity ? [node.mainEntity] : []);
    if (entities.length === 0) { issues.push({ kind: 'faq-empty', severity: 'important', message: 'FAQPage has no mainEntity questions' }); return issues; }
    entities.forEach((q, i) => {
      if (!q || !q.name || !String(q.name).trim()) issues.push({ kind: 'faq-missing-name', severity: 'critical', message: `FAQ item ${i + 1} missing question name` });
      const ans = q && q.acceptedAnswer;
      const text = ans && (typeof ans === 'string' ? ans : ans.text);
      if (!text || !String(text).trim()) {
        issues.push({ kind: 'faq-empty-answer', severity: 'critical', message: `FAQ item ${i + 1} ("${(q && q.name || '').slice(0, 40)}") has an empty/missing answer` });
      } else {
        const tags = String(text).match(/<\s*([a-zA-Z0-9]+)/g) || [];
        const bad = tags.map((t) => t.replace(/[<\s]/g, '').toLowerCase()).filter((t) => !this.allowedFaqTags.has(t));
        if (bad.length) issues.push({ kind: 'faq-disallowed-html', severity: 'important', message: `FAQ item ${i + 1} answer contains disallowed HTML: <${[...new Set(bad)].join('>, <')}>` });
      }
    });
    return issues;
  }
}

module.exports = { StructuredDataAuditor };
