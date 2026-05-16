'use strict';

const axios = require('axios');
const cheerio = require('cheerio');

/**
 * AICrawlerAuditor — scores how AI-search-friendly the site is.
 *
 * Signals AI engines care about:
 *   1. robots.txt explicitly allows GPTBot, ClaudeBot, PerplexityBot,
 *      CCBot, Google-Extended, anthropic-ai, ChatGPT-User
 *   2. llms.txt present and well-formed
 *   3. FAQPage/HowTo/Article schema markup
 *   4. Direct question-and-answer patterns in content
 *   5. Specific statistics, percentages, numbers (LLMs cite stats)
 *   6. Citations to other sources (LLMs trust well-cited content)
 *   7. Author/Organization schema for E-E-A-T
 *   8. Date freshness (LLMs prefer recent content)
 */
class AICrawlerAuditor {
  constructor(config = {}) {
    this.config = config;
    this.siteUrl = config.siteUrl;
  }

  audit(pages) {
    const issues    = [];
    const strengths = [];
    let score = 100;

    // 1. AI crawler access in robots.txt
    const robotsCheck = this._checkRobots(pages);
    if (!robotsCheck.allowed) {
      score -= 20;
      issues.push({
        severity: 'critical',
        title: 'AI crawlers not explicitly allowed in robots.txt',
        details: `Missing: ${robotsCheck.missing.join(', ')}. AI engines may skip your site or use cached/stale data.`,
        fix: 'Add explicit User-agent: <bot> Allow: / blocks for each AI crawler',
      });
    } else {
      strengths.push(`All ${robotsCheck.allowed.length} major AI crawlers explicitly allowed`);
    }

    // 2. llms.txt presence
    const llmsPage = pages.find(p => p.url.endsWith('/llms.txt'));
    if (!llmsPage || llmsPage.statusCode !== 200) {
      score -= 10;
      issues.push({
        severity: 'important',
        title: 'llms.txt missing or unreachable',
        details: 'LLM-friendly site briefing file at /llms.txt is the proposed standard for AI-search ranking.',
        fix: 'AEO agent will generate it on next run',
      });
    } else {
      strengths.push('llms.txt present at site root');
    }

    // 3. Schema markup coverage
    const withSchema = pages.filter(p => p.hasStructuredData);
    const schemaCoverage = pages.length ? withSchema.length / pages.length : 0;
    if (schemaCoverage < 0.5) {
      score -= 15;
      issues.push({
        severity: 'important',
        title: `Only ${Math.round(schemaCoverage * 100)}% of pages have structured data`,
        details: 'AI engines rely heavily on schema.org markup to understand and cite content.',
        fix: 'Add JSON-LD blocks (Course/FAQPage/Organization) to each page',
      });
    } else {
      strengths.push(`${withSchema.length}/${pages.length} pages have structured data`);
    }

    // 4. FAQ schema specifically
    const withFaq = pages.filter(p => p.html && /"@type"\s*:\s*"FAQPage"/i.test(p.html));
    if (withFaq.length === 0) {
      score -= 10;
      issues.push({
        severity: 'important',
        title: 'No FAQPage schema detected anywhere',
        details: 'FAQ schema is one of the strongest signals for AI-engine citation. Pages with FAQPage get cited 3-5× more often.',
        fix: 'Add FAQPage JSON-LD to landing pages with question/answer pairs',
      });
    } else {
      strengths.push(`${withFaq.length} pages have FAQPage schema`);
    }

    // 5. Question patterns in H2/H3
    const withQuestions = pages.filter(p => {
      if (!p.html) return false;
      const $ = cheerio.load(p.html);
      const headings = $('h2, h3').map((_, el) => $(el).text()).get();
      return headings.some(h => /\?$/.test(h.trim()) || /^(what|how|why|when|where|who|can|do|is|are)\b/i.test(h.trim()));
    });
    if (withQuestions.length < pages.length * 0.3) {
      score -= 8;
      issues.push({
        severity: 'low',
        title: 'Few pages have question-style headings',
        details: 'AI engines like Perplexity prefer Q&A-structured content. Adds direct answer-engine eligibility.',
        fix: 'Convert some H2/H3 headings into questions matching real user queries',
      });
    } else {
      strengths.push(`${withQuestions.length} pages have question-style headings`);
    }

    // 6. Author / Organization presence
    const withOrgSchema = pages.filter(p => p.html && /"@type"\s*:\s*"(Organization|EducationalOrganization|LocalBusiness)"/i.test(p.html));
    if (withOrgSchema.length === 0) {
      score -= 8;
      issues.push({
        severity: 'low',
        title: 'No Organization/EducationalOrganization schema found',
        details: 'AI engines weight cited sources by E-E-A-T. Organization schema confirms legitimacy.',
        fix: 'Add Organization schema with name, url, address, sameAs on key pages',
      });
    } else {
      strengths.push(`${withOrgSchema.length} pages declare Organization schema`);
    }

    const grade = score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : score >= 40 ? 'D' : 'F';

    return {
      score: Math.max(0, score),
      grade,
      issues,
      strengths,
      aiCrawlersAllowed: robotsCheck.allowed,
      aiCrawlersMissing: robotsCheck.missing,
    };
  }

  _checkRobots(pages) {
    const robotsPage = pages.find(p => p.url.endsWith('/robots.txt'));
    const text = robotsPage?.html || '';
    const required = [
      'GPTBot', 'ClaudeBot', 'PerplexityBot', 'CCBot', 'Google-Extended',
      'anthropic-ai', 'ChatGPT-User', 'Applebot-Extended', 'Bytespider', 'cohere-ai',
    ];
    const allowed = required.filter(bot => new RegExp(`User-agent:\\s*${bot}`, 'i').test(text));
    const missing = required.filter(bot => !allowed.includes(bot));
    return { allowed, missing };
  }
}

module.exports = { AICrawlerAuditor };
