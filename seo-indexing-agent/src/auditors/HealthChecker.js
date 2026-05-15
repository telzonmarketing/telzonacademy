'use strict';

const axios = require('axios');

/**
 * Lightweight health check — runs hourly to verify the site is alive
 * and its critical SEO surfaces (sitemap, robots, key pages) are reachable.
 * Designed to complete in under 30 seconds so we can run it frequently.
 */
class HealthChecker {
  constructor(config = {}) {
    this.config = config;
    this.timeoutMs = 10000;
  }

  async check(siteUrl) {
    const base = siteUrl.replace(/\/$/, '');
    const checks = [
      { url: base,                     name: 'Homepage',        critical: true  },
      { url: `${base}/sitemap.xml`,    name: 'Sitemap',         critical: true  },
      { url: `${base}/robots.txt`,     name: 'Robots.txt',      critical: true  },
      { url: `${base}/seo-dashboard.html`, name: 'Dashboard',   critical: false },
    ];

    // Also probe a few discovered pages from the sitemap (max 5)
    try {
      const sitemap = await axios.get(`${base}/sitemap.xml`, { timeout: this.timeoutMs });
      const matches = [...sitemap.data.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
      const sampled = matches.slice(0, 5);
      for (const url of sampled) {
        checks.push({ url, name: url.replace(base, ''), critical: false });
      }
    } catch (_) {}

    const results = [];
    for (const c of checks) {
      const start = Date.now();
      try {
        const res = await axios.get(c.url, {
          timeout: this.timeoutMs,
          validateStatus: () => true,
          maxRedirects: 5,
        });
        const elapsed = Date.now() - start;
        results.push({
          ...c,
          status: res.status,
          ok:     res.status >= 200 && res.status < 400,
          ms:     elapsed,
        });
      } catch (err) {
        results.push({
          ...c,
          status: 0,
          ok:     false,
          ms:     Date.now() - start,
          error:  err.message,
        });
      }
    }

    const failed = results.filter(r => !r.ok);
    const criticalFailed = failed.filter(r => r.critical);
    const avgMs = Math.round(results.reduce((s, r) => s + r.ms, 0) / results.length);

    return {
      timestamp: new Date().toISOString(),
      siteUrl: base,
      totalChecks: results.length,
      passed: results.length - failed.length,
      failed: failed.length,
      criticalFailed: criticalFailed.length,
      avgResponseMs: avgMs,
      results,
      healthy: criticalFailed.length === 0,
    };
  }
}

module.exports = { HealthChecker };
