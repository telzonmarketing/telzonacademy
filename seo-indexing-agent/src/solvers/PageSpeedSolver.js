'use strict';

const https = require('https');

/**
 * PageSpeedSolver — uses Google PageSpeed Insights API (FREE, no auth)
 * to get concrete, actionable performance fixes for any URL.
 *
 * The API returns "opportunities" with exact savings in KB and ms.
 * We convert each into a fix recommendation the bot can either:
 *   - Auto-commit (e.g. lazy-load images, preload fonts)
 *   - Or surface as a diagnosis with exact file/element to change
 */
class PageSpeedSolver {
  constructor(config = {}) {
    this.config = config;
    this.name = 'PageSpeed Insights';
  }

  /**
   * Higher score = better fit. Returns 0 if can't help.
   */
  score(issue) {
    const t = (issue.type || '').toUpperCase();
    if (t === 'CLIENT_SIDE_ONLY')   return 80;
    if (t.includes('PAGESPEED'))    return 100;
    if (t.includes('PERFORMANCE'))  return 100;
    if (t.includes('IMAGES'))       return 70;
    if (t.includes('CORE_WEB'))     return 100;
    if (t.includes('SLOW'))         return 60;
    return 0;
  }

  async attempt(issue, ctx) {
    const url = ctx.siteUrl || issue.url;
    if (!url) return { solved: false, reason: 'no-url-in-context' };

    const data = await this._call(url);
    if (!data) return { solved: false, reason: 'api-call-failed' };

    const opps = this._extractOpportunities(data);
    const score = data.lighthouseResult?.categories?.performance?.score;

    const diagnosis = {
      performanceScore: score ? Math.round(score * 100) : null,
      opportunities: opps.slice(0, 5),
      summary: `PageSpeed score ${score ? Math.round(score * 100) : '?'}/100. ${opps.length} concrete improvements identified.`,
    };

    // We've enriched the issue with exact, actionable data. The persistent
    // fixer will use this on next reconcile run to attempt the fix.
    return {
      solved: false,
      diagnosis,
      enrichment: { pageSpeed: diagnosis },
    };
  }

  _call(url) {
    const endpoint = `/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&category=performance`;
    return new Promise((resolve) => {
      const req = https.request({
        hostname: 'www.googleapis.com',
        path: endpoint,
        method: 'GET',
        timeout: 60000,
      }, (res) => {
        let body = '';
        res.on('data', (c) => { body += c; });
        res.on('end', () => {
          try { resolve(JSON.parse(body)); }
          catch (_) { resolve(null); }
        });
      });
      req.on('error', () => resolve(null));
      req.on('timeout', () => { req.destroy(); resolve(null); });
      req.end();
    });
  }

  _extractOpportunities(data) {
    const audits = data.lighthouseResult?.audits || {};
    const opps = [];
    for (const key in audits) {
      const a = audits[key];
      if (a.details?.type === 'opportunity' && (a.numericValue || 0) > 100) {
        opps.push({
          id:           a.id,
          title:        a.title,
          description:  a.description?.split('[')[0].trim(),
          savingsMs:    Math.round(a.numericValue),
          savingsHuman: a.displayValue || `${Math.round(a.numericValue)}ms`,
        });
      }
    }
    return opps.sort((a, b) => b.savingsMs - a.savingsMs);
  }
}

module.exports = { PageSpeedSolver };
