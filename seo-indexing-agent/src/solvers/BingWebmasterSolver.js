'use strict';

const https = require('https');

/**
 * BingWebmasterSolver — uses the Bing Webmaster Tools API to:
 *   - Submit URLs for indexing (10,000/day quota, way more than Google's 200)
 *   - Get crawl stats and errors
 *   - Force re-crawl of stale pages
 *
 * Free, requires BING_API_KEY env var. Get one at:
 * https://www.bing.com/webmasters/ → Settings → API access
 *
 * Designed to help win "page not indexed" issues that Google won't pick up.
 */
class BingWebmasterSolver {
  constructor(config = {}) {
    this.config = config;
    this.name = 'Bing Webmaster';
    this.apiKey = config.bingApiKey || process.env.BING_API_KEY;
  }

  score(issue) {
    if (!this.apiKey) return 0;
    const t = (issue.type || '').toUpperCase();
    if (t === 'NOT_INDEXED')         return 90;
    if (t.includes('INDEX'))         return 70;
    if (t.includes('CRAWL'))         return 80;
    if (t === 'CLIENT_SIDE_ONLY')    return 30;  // Bing is more tolerant of CSR
    return 0;
  }

  async attempt(issue, ctx) {
    if (!this.apiKey) {
      return { solved: false, reason: 'no-bing-api-key' };
    }
    const url = issue.url || ctx.siteUrl;
    if (!url) return { solved: false };

    const result = await this._submitUrl(url);
    if (result?.d === null) {
      return {
        solved: true,
        diagnosis: { message: `Bing Webmaster: URL submitted for indexing — ${url}` },
        fix: { type: 'bing-submit', url },
      };
    }
    return { solved: false, reason: result?.error || 'submission-failed' };
  }

  _submitUrl(url) {
    const body = JSON.stringify({ siteUrl: this.config.siteUrl, url });
    return new Promise((resolve) => {
      const req = https.request({
        hostname: 'ssl.bing.com',
        path: `/webmaster/api.svc/json/SubmitUrl?apikey=${this.apiKey}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(body),
        },
        timeout: 20000,
      }, (res) => {
        let data = '';
        res.on('data', (c) => { data += c; });
        res.on('end', () => {
          try { resolve(JSON.parse(data)); }
          catch (_) { resolve({ error: 'parse-failed' }); }
        });
      });
      req.on('error', (e) => resolve({ error: e.message }));
      req.on('timeout', () => { req.destroy(); resolve({ error: 'timeout' }); });
      req.write(body);
      req.end();
    });
  }
}

module.exports = { BingWebmasterSolver };
