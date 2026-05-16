'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { LLMsTxtBuilder } = require('./LLMsTxtBuilder');
const { AICrawlerAuditor } = require('./AICrawlerAuditor');
const { FAQSchemaGenerator } = require('./FAQSchemaGenerator');
const { AIVisibilityProbe } = require('./AIVisibilityProbe');
const { SiteCrawler } = require('../auditors/SiteCrawler');

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

    // 1. Crawl pages
    const crawler = new SiteCrawler(this.config);
    const pages = await crawler.crawl(this.siteUrl);
    console.log(`  Crawled ${pages.length} pages`);

    // 2. Refresh llms.txt + llms-full.txt
    const llms = new LLMsTxtBuilder(this.config);
    const llmsFiles = await llms.build(pages);
    console.log(`  ✓ Refreshed llms.txt (${llmsFiles.compact.length} bytes) + llms-full.txt (${llmsFiles.full.length} bytes)`);

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
}

module.exports = { AEOAgent };
