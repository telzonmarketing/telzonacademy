'use strict';

const { google } = require('googleapis');
const fs = require('fs');

class GoogleSearchConsole {
  constructor() {
    this.searchconsole = null;
  }

  async init() {
    if (this.searchconsole) return;

    let credentials;
    if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH) {
      try { credentials = JSON.parse(fs.readFileSync(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH, 'utf8')); } catch (_) {}
    }
    if (!credentials && process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      try { credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY); } catch (_) {}
    }

    if (!credentials) return;

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        'https://www.googleapis.com/auth/webmasters',
        'https://www.googleapis.com/auth/webmasters.readonly',
      ],
    });

    this.searchconsole = google.searchconsole({ version: 'v1', auth });
  }

  async getIndexingStatus(siteUrl, urls = []) {
    await this.init();
    if (!this.searchconsole) return null;

    const results = [];
    for (const url of urls.slice(0, 50)) { // GSC API limit
      try {
        const res = await this.searchconsole.urlInspection.index.inspect({
          requestBody: {
            inspectionUrl: url,
            siteUrl,
          },
        });
        results.push({
          url,
          verdict: res.data.inspectionResult?.indexStatusResult?.verdict,
          coverageState: res.data.inspectionResult?.indexStatusResult?.coverageState,
          robotsTxtState: res.data.inspectionResult?.indexStatusResult?.robotsTxtState,
          indexingState: res.data.inspectionResult?.indexStatusResult?.indexingState,
          lastCrawlTime: res.data.inspectionResult?.indexStatusResult?.lastCrawlTime,
        });
      } catch (_) {}
    }
    return results;
  }

  async submitSitemap(siteUrl, sitemapUrl) {
    await this.init();
    if (!this.searchconsole) return false;

    try {
      await this.searchconsole.sitemaps.submit({
        siteUrl,
        feedpath: sitemapUrl,
      });
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * Fetch top keywords and their positions from Google Search Console.
   * Returns array of { query, page, position, impressions, clicks, ctr }
   * sorted by impressions descending.
   */
  async getKeywordRankings(siteUrl, { startDate, endDate, rowLimit = 50 } = {}) {
    await this.init();
    if (!this.searchconsole) return [];

    // Default: last 28 days
    const end = endDate || new Date().toISOString().slice(0, 10);
    const start = startDate || new Date(Date.now() - 28 * 86400000).toISOString().slice(0, 10);

    try {
      const res = await this.searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: start,
          endDate: end,
          dimensions: ['query', 'page'],
          rowLimit,
          dimensionFilterGroups: [],
        },
      });

      const rows = res.data.rows || [];
      return rows.map(row => ({
        query:       row.keys[0],
        page:        row.keys[1],
        position:    Math.round(row.position * 10) / 10,   // 1 decimal place
        impressions: row.impressions,
        clicks:      row.clicks,
        ctr:         Math.round(row.ctr * 1000) / 10,      // percentage, 1 decimal
      }));
    } catch (err) {
      console.warn('  GSC searchAnalytics error:', err.message);
      return [];
    }
  }
}

module.exports = { GoogleSearchConsole };
