'use strict';

const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');
const xml2js = require('xml2js');

class SiteCrawler {
  constructor(config = {}) {
    this.config = config;
    this.visited = new Set();
    this.queue = [];
    this.pages = [];
    this.maxPages = config.maxPages || 1000;
    this.delay = config.crawlDelay || 500;
  }

  async crawl(startUrl) {
    if (!startUrl) throw new Error('No URL provided to crawl');

    const base = new URL(startUrl);
    this.baseOrigin = base.origin;
    this.baseDomain = base.hostname;

    // Seed queue with startUrl
    this.queue.push(startUrl);

    // Also seed from sitemap.xml so React SPAs get full page coverage
    try {
      const sitemapUrls = await this.getSitemapUrls(base.origin);
      for (const u of sitemapUrls) {
        if (!this.visited.has(u) && !this.queue.includes(u)) {
          this.queue.push(u);
        }
      }
      if (sitemapUrls.length > 0) {
        console.log(`  Seeded ${sitemapUrls.length} URLs from sitemap.xml`);
      }
    } catch (_) {
      // sitemap unavailable — continue with normal crawl
    }

    while (this.queue.length > 0 && this.pages.length < this.maxPages) {
      const url = this.queue.shift();
      if (this.visited.has(url)) continue;
      this.visited.add(url);

      try {
        const page = await this.fetchPage(url);
        if (page) {
          this.pages.push(page);
          const links = this.extractLinks(page.html, url);
          links.forEach(link => {
            if (!this.visited.has(link) && !this.queue.includes(link)) {
              this.queue.push(link);
            }
          });
        }
      } catch (err) {
        // skip unreachable pages
      }

      if (this.delay > 0) await this.sleep(this.delay);
    }

    return this.pages;
  }

  /**
   * Fetch all <loc> URLs from sitemap.xml (and nested sitemaps).
   */
  async getSitemapUrls(baseOrigin) {
    const urls = [];
    const sitemapUrl = `${baseOrigin}/sitemap.xml`;

    try {
      const res = await axios.get(sitemapUrl, {
        timeout: 8000,
        headers: { 'User-Agent': 'SEOIndexingAgent/1.0 (compatible; Googlebot/2.1)' },
        validateStatus: null,
      });
      if (res.status !== 200 || !res.data) return urls;

      const parsed = await xml2js.parseStringPromise(res.data, { explicitArray: false });

      // Sitemap index (contains <sitemap> entries)
      if (parsed.sitemapindex) {
        const sitemaps = [].concat(parsed.sitemapindex.sitemap || []);
        for (const sm of sitemaps) {
          const loc = sm.loc;
          if (!loc) continue;
          try {
            const nested = await this.getSitemapUrlsFromUrl(loc);
            urls.push(...nested);
          } catch (_) {}
        }
      }

      // Regular urlset
      if (parsed.urlset) {
        const urlEntries = [].concat(parsed.urlset.url || []);
        for (const u of urlEntries) {
          const loc = typeof u === 'string' ? u : u.loc;
          if (loc && typeof loc === 'string') {
            try {
              const parsed2 = new URL(loc);
              if (parsed2.origin === baseOrigin) urls.push(loc.split('?')[0]);
            } catch (_) {}
          }
        }
      }
    } catch (_) {}

    return [...new Set(urls)];
  }

  async getSitemapUrlsFromUrl(sitemapUrl) {
    const urls = [];
    try {
      const res = await axios.get(sitemapUrl, {
        timeout: 8000,
        headers: { 'User-Agent': 'SEOIndexingAgent/1.0 (compatible; Googlebot/2.1)' },
        validateStatus: null,
      });
      if (res.status !== 200 || !res.data) return urls;
      const parsed = await xml2js.parseStringPromise(res.data, { explicitArray: false });
      if (parsed.urlset) {
        const urlEntries = [].concat(parsed.urlset.url || []);
        for (const u of urlEntries) {
          const loc = typeof u === 'string' ? u : u.loc;
          if (loc && typeof loc === 'string') urls.push(loc.split('?')[0]);
        }
      }
    } catch (_) {}
    return urls;
  }

  async fetchPage(url) {
    const start = Date.now();
    try {
      const res = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'SEOIndexingAgent/1.0 (compatible; Googlebot/2.1)',
          'Accept': 'text/html,application/xhtml+xml',
        },
        maxRedirects: 5,
        validateStatus: null,
      });

      const loadTime = Date.now() - start;
      const $ = cheerio.load(res.data || '');

      return {
        url,
        statusCode: res.status,
        html: res.data || '',
        title: $('title').text().trim(),
        metaDescription: $('meta[name="description"]').attr('content') || '',
        metaRobots: $('meta[name="robots"]').attr('content') || '',
        canonicalUrl: $('link[rel="canonical"]').attr('href')
          || this._canonicalFromLinkHeader(res.headers?.link || res.headers?.Link)
          || '',
        h1: $('h1').first().text().trim(),
        hasStructuredData: $('script[type="application/ld+json"]').length > 0,
        contentLength: (res.data || '').length,
        loadTime,
        headers: res.headers,
        redirectChain: res.request?.res?.responseUrl !== url ? [url, res.request?.res?.responseUrl] : [],
        isIndexable: this.checkIndexable($, res.headers),
        links: [],
      };
    } catch (err) {
      return {
        url,
        statusCode: 0,
        error: err.message,
        isIndexable: false,
      };
    }
  }

  /**
   * Parse canonical URL from HTTP Link header per RFC 5988.
   * Format: '<https://example.com/page>; rel="canonical"'
   * Google honors this exactly like <link rel="canonical">.
   */
  _canonicalFromLinkHeader(linkHeader) {
    if (!linkHeader) return '';
    const headers = Array.isArray(linkHeader) ? linkHeader : [linkHeader];
    for (const h of headers) {
      const m = h.match(/<([^>]+)>\s*;\s*rel\s*=\s*["']?canonical["']?/i);
      if (m) return m[1];
    }
    return '';
  }

  checkIndexable($, headers) {
    const metaRobots = $('meta[name="robots"]').attr('content') || '';
    const xRobotsTag = headers?.['x-robots-tag'] || '';
    const noindex = /noindex/i.test(metaRobots) || /noindex/i.test(xRobotsTag);
    return !noindex;
  }

  extractLinks(html, baseUrl) {
    const $ = cheerio.load(html || '');
    const links = [];

    $('a[href]').each((_, el) => {
      try {
        const href = $(el).attr('href');
        const resolved = new URL(href, baseUrl).href;
        const parsed = new URL(resolved);

        if (
          parsed.origin === this.baseOrigin &&
          !resolved.includes('#') &&
          !resolved.match(/\.(pdf|jpg|jpeg|png|gif|svg|ico|css|js|woff|woff2|ttf|zip|mp4|mp3)$/i) &&
          !resolved.includes('/api/') &&
          !resolved.includes('/_next/') &&
          !resolved.includes('/admin/')
        ) {
          links.push(resolved.split('?')[0]);
        }
      } catch (_) {}
    });

    return [...new Set(links)];
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = { SiteCrawler };
