'use strict';

const https = require('https');

/**
 * W3CValidatorSolver — uses the W3C Nu HTML Checker (FREE, no auth)
 * to get exact HTML errors per page. Specifically valuable for:
 *   - Missing H1 (returns the parent element + line number)
 *   - Duplicate IDs (rare but tanks rankings)
 *   - Malformed structured data
 *   - Bad meta tags
 *
 * https://validator.w3.org/nu/
 */
class W3CValidatorSolver {
  constructor(config = {}) {
    this.config = config;
    this.name = 'W3C Validator';
  }

  score(issue) {
    const t = (issue.type || '').toUpperCase();
    if (t === 'MISSING_H1')           return 100;
    if (t === 'DUPLICATE_TITLE')      return 80;
    if (t === 'INVALID_HTML')         return 100;
    if (t.includes('META'))           return 60;
    if (t.includes('HEADING'))        return 90;
    return 0;
  }

  async attempt(issue, ctx) {
    const url = ctx.siteUrl || issue.url;
    if (!url) return { solved: false };

    const validation = await this._validate(url);
    if (!validation) return { solved: false, reason: 'validator-unavailable' };

    const errors = (validation.messages || []).filter(m => m.type === 'error');
    const warnings = (validation.messages || []).filter(m => m.type === 'info' || m.subType === 'warning');

    const diagnosis = {
      errorCount:   errors.length,
      warningCount: warnings.length,
      topErrors: errors.slice(0, 5).map(e => ({
        message:    e.message,
        extract:    e.extract,
        line:       e.lastLine || e.firstLine,
        column:     e.lastColumn,
      })),
      summary: `W3C: ${errors.length} HTML errors, ${warnings.length} warnings on ${url}`,
    };

    return {
      solved: false,
      diagnosis,
      enrichment: { w3c: diagnosis },
    };
  }

  _validate(url) {
    return new Promise((resolve) => {
      const req = https.request({
        hostname: 'validator.w3.org',
        path: `/nu/?doc=${encodeURIComponent(url)}&out=json`,
        method: 'GET',
        headers: { 'User-Agent': 'SEO-Indexing-Agent/1.0' },
        timeout: 30000,
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
}

module.exports = { W3CValidatorSolver };
