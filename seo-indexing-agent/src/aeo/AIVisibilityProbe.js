'use strict';

const https = require('https');

/**
 * AIVisibilityProbe — checks whether AI search engines actually return
 * results citing our site.
 *
 * Two strategies:
 *  1. Direct API (when key available) — Perplexity API.
 *  2. Public search probes — Brave Search API free tier (covers a wider
 *     surface) checks if "telzon academy nagpur" returns our domain.
 *
 * For OpenAI/Anthropic/Gemini there's no public ranking API; visibility on
 * those is inferred from llms.txt access logs and IndexNow uptake.
 */
class AIVisibilityProbe {
  constructor(config = {}) {
    this.config = config;
    this.siteUrl = config.siteUrl;
    this.host = this.siteUrl ? new URL(this.siteUrl).host : '';
    this.perplexityKey = process.env.PERPLEXITY_API_KEY;
    this.braveKey      = process.env.BRAVE_SEARCH_API_KEY;
  }

  async check() {
    const queries = [
      'best digital marketing course in nagpur',
      'digital marketing institute nagpur',
      'telzon academy',
    ];

    const results = [];

    for (const q of queries) {
      const r = await this._probe(q);
      results.push({ query: q, ...r });
    }

    const citingCount = results.filter(r => r.cited).length;
    return {
      checked: results.length,
      citingCount,
      perEngine: results,
      perplexityActive: !!this.perplexityKey,
      braveActive: !!this.braveKey,
    };
  }

  async _probe(query) {
    // Try Brave Search if key available (covers OpenAI's web tool surface)
    if (this.braveKey) {
      try {
        const r = await this._brave(query);
        return { source: 'brave', ...r };
      } catch (_) {}
    }

    // Try Perplexity if available
    if (this.perplexityKey) {
      try {
        const r = await this._perplexity(query);
        return { source: 'perplexity', ...r };
      } catch (_) {}
    }

    // No-auth fallback: hit DuckDuckGo HTML (used by some AI engines)
    return await this._ddg(query);
  }

  _brave(query) {
    return new Promise((resolve, reject) => {
      const req = https.request({
        hostname: 'api.search.brave.com',
        path: `/res/v1/web/search?q=${encodeURIComponent(query)}&count=10`,
        headers: { 'X-Subscription-Token': this.braveKey, 'Accept': 'application/json' },
        timeout: 20000,
      }, res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            const results = json.web?.results || [];
            const ourHit = results.findIndex(r => (r.url || '').includes(this.host));
            resolve({
              cited: ourHit >= 0,
              position: ourHit >= 0 ? ourHit + 1 : null,
              competitors: results.slice(0, 3).map(r => r.url),
            });
          } catch (e) { reject(e); }
        });
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
      req.end();
    });
  }

  _perplexity(query) {
    const body = JSON.stringify({
      model: 'sonar-small',
      messages: [{ role: 'user', content: `${query} — what are the best options?` }],
    });
    return new Promise((resolve, reject) => {
      const req = https.request({
        hostname: 'api.perplexity.ai',
        path: '/chat/completions',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.perplexityKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        timeout: 30000,
      }, res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            const text = json.choices?.[0]?.message?.content || '';
            const citations = json.citations || [];
            const cited = citations.some(c => c.includes(this.host)) || text.includes(this.host);
            resolve({ cited, citations: citations.slice(0, 5), preview: text.slice(0, 200) });
          } catch (e) { reject(e); }
        });
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
      req.write(body);
      req.end();
    });
  }

  _ddg(query) {
    return new Promise((resolve) => {
      const req = https.request({
        hostname: 'duckduckgo.com',
        path: `/html/?q=${encodeURIComponent(query)}`,
        headers: { 'User-Agent': 'Mozilla/5.0 SEO-AEO-Agent/1.0' },
        timeout: 15000,
      }, res => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          const hits = (data.match(/uddg=([^"&]+)/g) || []).map(m => decodeURIComponent(m.slice(5)));
          const ourHit = hits.findIndex(u => u.includes(this.host));
          resolve({
            source: 'duckduckgo',
            cited: ourHit >= 0,
            position: ourHit >= 0 ? ourHit + 1 : null,
            competitors: hits.slice(0, 3),
          });
        });
      });
      req.on('error', () => resolve({ source: 'duckduckgo', cited: false, error: 'request-failed' }));
      req.on('timeout', () => { req.destroy(); resolve({ source: 'duckduckgo', cited: false, error: 'timeout' }); });
      req.end();
    });
  }
}

module.exports = { AIVisibilityProbe };
