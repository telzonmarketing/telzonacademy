'use strict';

const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Crawls each known page once and HEAD-checks every internal/external link
 * found in <a href>. Reports 4xx/5xx responses as broken-link issues.
 * Keeps a cache so the same target URL is only checked once per run.
 */
class BrokenLinkChecker {
  constructor(config = {}) {
    this.config = config;
    this.cache = new Map();
    this.timeoutMs = 8000;
    this.maxLinksPerPage = 50;
  }

  async check(pages) {
    const broken = [];
    const summaries = [];

    for (const page of pages.slice(0, 100)) {
      if (!page.html) continue;
      const $ = cheerio.load(page.html);
      const hrefs = [];
      $('a[href]').slice(0, this.maxLinksPerPage).each((_, el) => {
        const href = $(el).attr('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
        try {
          const abs = new URL(href, page.url).toString();
          hrefs.push(abs);
        } catch (_) {}
      });

      for (const link of hrefs) {
        if (this.cache.has(link)) {
          const status = this.cache.get(link);
          if (status >= 400) {
            broken.push({ from: page.url, to: link, status });
          }
          continue;
        }
        try {
          const res = await axios.head(link, {
            timeout: this.timeoutMs,
            validateStatus: () => true,
            maxRedirects: 5,
          });
          this.cache.set(link, res.status);
          if (res.status >= 400) {
            broken.push({ from: page.url, to: link, status: res.status });
          }
        } catch (err) {
          this.cache.set(link, 0);
          broken.push({ from: page.url, to: link, status: 0, error: err.message });
        }
      }
    }

    // Deduplicate broken targets for summary
    const uniqueBroken = [...new Set(broken.map(b => b.to))];

    if (uniqueBroken.length > 0) {
      summaries.push({
        severity: 'important',
        type: 'BROKEN_LINKS',
        title: `${uniqueBroken.length} broken link${uniqueBroken.length === 1 ? '' : 's'} found across the site`,
        description: 'Broken links waste crawl budget and signal poor maintenance to Google. Fix or remove them.',
        affected: broken.slice(0, 20),
      });
    }

    return { broken, summaries };
  }
}

module.exports = { BrokenLinkChecker };
