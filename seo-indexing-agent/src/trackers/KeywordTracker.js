'use strict';

const { GoogleSearchConsole } = require('../submitters/GoogleSearchConsole');

/**
 * KeywordTracker — pulls keyword rankings from Google Search Console daily,
 * computes position changes vs previous snapshot, and categorises keywords.
 */
class KeywordTracker {
  constructor(config = {}) {
    this.config = config;
    this.gsc = new GoogleSearchConsole();
  }

  /**
   * Fetch current keyword rankings and compute change vs previousKeywords.
   * @param {string} siteUrl  - e.g. 'https://telzonacademy.in'
   * @param {Array}  previousKeywords - array from last run (may be empty)
   * @returns {{ keywords, summary }}
   */
  async track(siteUrl, previousKeywords = []) {
    console.log('  Fetching keyword rankings from Google Search Console...');

    const keywords = await this.gsc.getKeywordRankings(siteUrl, { rowLimit: 100 });

    if (!keywords.length) {
      console.log('  No keyword data available (GSC may need a few days to populate)');
      return { keywords: [], summary: this._emptySummary() };
    }

    // Build lookup from previous snapshot for change calculation
    const prevMap = {};
    for (const kw of previousKeywords) {
      prevMap[kw.query] = kw.position;
    }

    // Annotate each keyword with position change and category
    const annotated = keywords.map(kw => {
      const prevPos = prevMap[kw.query];
      const change = prevPos != null ? Math.round((prevPos - kw.position) * 10) / 10 : null;
      return {
        ...kw,
        change,           // positive = improved (moved up), negative = dropped
        category: this._category(kw.position),
      };
    });

    // Sort: first by impressions desc (most visible keywords on top)
    annotated.sort((a, b) => b.impressions - a.impressions);

    const summary = this._buildSummary(annotated);

    console.log(`  Tracked ${annotated.length} keywords — avg position: ${summary.avgPosition}`);
    if (summary.improved > 0) console.log(`  ↑ ${summary.improved} keywords improved`);
    if (summary.dropped > 0)  console.log(`  ↓ ${summary.dropped} keywords dropped`);

    return { keywords: annotated, summary };
  }

  /** Bucket a position number into a display category */
  _category(position) {
    if (position <= 3)  return 'top3';
    if (position <= 10) return 'page1';
    if (position <= 20) return 'almost';   // "almost page 1" — high opportunity
    if (position <= 50) return 'page2to5';
    return 'beyond';
  }

  _buildSummary(keywords) {
    if (!keywords.length) return this._emptySummary();

    const avgPosition = Math.round(
      keywords.reduce((s, k) => s + k.position, 0) / keywords.length * 10
    ) / 10;

    const totalImpressions = keywords.reduce((s, k) => s + k.impressions, 0);
    const totalClicks      = keywords.reduce((s, k) => s + k.clicks, 0);
    const avgCtr           = totalImpressions > 0
      ? Math.round(totalClicks / totalImpressions * 1000) / 10
      : 0;

    const improved = keywords.filter(k => k.change != null && k.change > 0).length;
    const dropped  = keywords.filter(k => k.change != null && k.change < 0).length;

    const byCategory = {
      top3:     keywords.filter(k => k.category === 'top3').length,
      page1:    keywords.filter(k => k.category === 'page1').length,
      almost:   keywords.filter(k => k.category === 'almost').length,
      page2to5: keywords.filter(k => k.category === 'page2to5').length,
      beyond:   keywords.filter(k => k.category === 'beyond').length,
    };

    // Top 5 most improved keywords (biggest position gains)
    const topGainers = keywords
      .filter(k => k.change != null && k.change > 0)
      .sort((a, b) => b.change - a.change)
      .slice(0, 5)
      .map(k => ({ query: k.query, change: k.change, position: k.position }));

    // Top opportunity: high impressions, position 11-20 (almost page 1)
    const opportunities = keywords
      .filter(k => k.category === 'almost')
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 10)
      .map(k => ({ query: k.query, position: k.position, impressions: k.impressions }));

    return {
      avgPosition,
      totalImpressions,
      totalClicks,
      avgCtr,
      improved,
      dropped,
      byCategory,
      topGainers,
      opportunities,
      total: keywords.length,
    };
  }

  _emptySummary() {
    return {
      avgPosition: null, totalImpressions: 0, totalClicks: 0, avgCtr: 0,
      improved: 0, dropped: 0,
      byCategory: { top3: 0, page1: 0, almost: 0, page2to5: 0, beyond: 0 },
      topGainers: [], opportunities: [], total: 0,
    };
  }
}

module.exports = { KeywordTracker };
