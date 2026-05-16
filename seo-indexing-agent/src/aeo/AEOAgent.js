'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const axios = require('axios');
const cheerio = require('cheerio');
const { LLMsTxtBuilder } = require('./LLMsTxtBuilder');
const { AICrawlerAuditor } = require('./AICrawlerAuditor');
const { FAQSchemaGenerator } = require('./FAQSchemaGenerator');
const { AIVisibilityProbe } = require('./AIVisibilityProbe');

/**
 * AEOAgent — Answer Engine Optimization for AI search engines.
 *
 * Where SEO targets Google's blue links, AEO targets the citations and
 * direct-answer surfaces of ChatGPT, Claude, Perplexity, Gemini, Bing
 * Copilot, and Google AI Overviews. Different signals matter:
 *
 *   - llms.txt / llms-full.txt for LLM-friendly site briefing
 *   - Robots.txt explicitly allowing AI crawlers (GPTBot, ClaudeBot,
 *     PerplexityBot, CCBot, Google-Extended, etc.)
 *   - FAQPage / HowTo schema for citation-eligibility
 *   - Direct Q&A patterns in content
 *   - Specific numbers, stats, and citations
 *   - Brand-mention tracking on AI search results
 *
 * Runs daily and produces:
 *   - public/llms.txt (auto-refreshed from sitemap + page meta)
 *   - public/llms-full.txt (full markdown digest)
 *   - public/seo-reports/aeo-report.json (audit results)
 *   - Activity log entries
 */
class AEOAgent {
  constructor(config = {}) {
    this.config = config;
    this.siteUrl = config.siteUrl;
    this.publicDir = config.publicDir || '../public';
    this.reportsDir = config.reportsDir || '../public/seo-reports';
  }

  async run() {
    if (!this.siteUrl) throw new Error('siteUrl required for AEOAgent');

    console.log(chalk.bold.magenta('\n[ AEO ] Answer Engine Optimization run\n'));

    // 1. Crawl pages — pull URLs from sitemap directly (more reliable than
    //    BFS crawl for a React SPA), then fetch each in parallel.
    const sitemapUrls = await this._fetchSitemapUrls(this.siteUrl);
    console.log(`  Found ${sitemapUrls.length} URLs in sitemap`);
    const pages = await this._fetchAll(sitemapUrls.slice(0, 100));
    console.log(`  Fetched ${pages.length} pages`);

    // 2. Refresh llms.txt + llms-full.txt — only if we actually got pages,
    //    so we never overwrite a good file with a tiny stub
    let llmsFiles = { compact: '', full: '' };
    if (pages.length >= 5) {
      const llms = new LLMsTxtBuilder(this.config);
      llmsFiles = await llms.build(pages);
      console.log(`  ✓ Refreshed llms.txt (${llmsFiles.compact.length} bytes) + llms-full.txt (${llmsFiles.full.length} bytes)`);
    } else {
      console.log(`  ⚠ Skipping llms.txt refresh — only ${pages.length} pages fetched (would overwrite good file)`);
    }

    // 3. AI-friendliness audit
    const aiAudit = new AICrawlerAuditor(this.config);
    const aiAuditResult = await aiAudit.audit(pages);
    console.log(`  AI-friendliness score: ${chalk.bold(aiAuditResult.score + '/100')} (${aiAuditResult.grade})`);

    // 4. Generate FAQ schema suggestions for landing pages
    const faqGen = new FAQSchemaGenerator(this.config);
    const faqSuggestions = faqGen.generate(pages);
    console.log(`  Generated ${faqSuggestions.length} FAQ schema suggestions`);

    // 5. AI visibility probe — check if site is cited by Perplexity-style engines
    const probe = new AIVisibilityProbe(this.config);
    const visibility = await probe.check();
    console.log(`  AI visibility: ${visibility.checked} engines probed, ${visibility.citingCount} citing the site`);

    // 6. Compile report
    const report = {
      timestamp: new Date().toISOString(),
      pagesAudited: pages.length,
      score: aiAuditResult.score,
      grade: aiAuditResult.grade,
      issues: aiAuditResult.issues,
      strengths: aiAuditResult.strengths,
      llms: {
        compactBytes: llmsFiles.compact.length,
        fullBytes:    llmsFiles.full.length,
      },
      faqSuggestions,
      visibility,
      aiCrawlers: aiAuditResult.aiCrawlersAllowed,
    };

    fs.mkdirSync(this.reportsDir, { recursive: true });
    fs.writeFileSync(
      path.join(this.reportsDir, 'aeo-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log(chalk.green(`\n  ✓ AEO report saved · ${aiAuditResult.score}/100 (${aiAuditResult.grade})`));
    return report;
  }

  async _fetchSitemapUrls(siteUrl) {
    const base = siteUrl.replace(/\/$/, '');
    try {
      const res = await axios.get(`${base}/sitemap.xml`, {
        timeout: 15000,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AEO-Auditor/1.0; +https://telzonacademy.in)' },
      });
      const matches = [...(res.data || '').matchAll(/<loc>([^<]+)<\/loc>/g)];
      return matches.map(m => m[1]);
    } catch (e) {
      console.log(`  ⚠ Sitemap fetch failed: ${e.message}`);
      return [siteUrl];
    }
  }

  async _fetchAll(urls) {
    const out = [];
    // Sequential to be polite — 100 URLs at ~500ms each = 50s max
    for (const url of urls) {
      try {
        const start = Date.now();
        const res = await axios.get(url, {
          timeout: 12000,
          validateStatus: () => true,
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AEO-Auditor/1.0; +https://telzonacademy.in)' },
        });
        if (res.status >= 200 && res.status < 400) {
          const $ = cheerio.load(res.data || '');
          out.push({
            url,
            statusCode: res.status,
            html: res.data || '',
            title: $('title').text().trim(),
            metaDescription: $('meta[name="description"]').attr('content') || '',
            metaRobots: $('meta[name="robots"]').attr('content') || '',
            canonicalUrl: $('link[rel="canonical"]').attr('href') || '',
            h1: $('h1').first().text().trim(),
            hasStructuredData: $('script[type="application/ld+json"]').length > 0,
            isIndexable: !/noindex/i.test($('meta[name="robots"]').attr('content') || ''),
            loadTime: Date.now() - start,
          });
        }
      } catch (_) {}
    }
    return out;
  }
}

module.exports = { AEOAgent };
