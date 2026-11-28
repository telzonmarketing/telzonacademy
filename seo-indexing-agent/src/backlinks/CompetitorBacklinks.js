'use strict';

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');

/**
 * CompetitorBacklinks — automated competitor citation / link-gap finder.
 *
 * True full backlink indexes (Ahrefs/Semrush) are paid. This module uses the
 * Brave Search API (already configured) to discover the *citation-style*
 * referring domains a competitor has — directories, listings, review sites,
 * local blogs — i.e. exactly the backlinks a local business can replicate.
 * It then computes the GAP: domains that cite competitors but not you, ranked
 * by how many competitors they cite (a strong "you should be here too" signal).
 *
 * Honest scope: this finds the actionable/replicable local-SEO citations, not
 * every editorial link. If an AHREFS_API_KEY is later provided, the discovery
 * step can be swapped for a full backlink pull with no other changes.
 *
 * Output: public/seo-reports/competitor-backlinks.json → dashboard renders it.
 */

// Hosts that are never useful as "go get a link here" targets (search engines,
// the social giants' root domains, CDNs, etc.). Listing/citation sites are kept.
const NOISE_HOSTS = new Set([
  'google.com', 'google.co.in', 'bing.com', 'duckduckgo.com', 'yahoo.com',
  'facebook.com', 'instagram.com', 'twitter.com', 'x.com', 'youtube.com',
  'linkedin.com', 'pinterest.com', 'wikipedia.org', 'gstatic.com',
  'translate.google.com', 'webcache.googleusercontent.com',
]);

// Classify a referring host so the user knows how to act on it.
const DIRECTORY_HINTS = ['justdial', 'sulekha', 'indiamart', 'urbanpro', 'shiksha',
  'yelp', 'glassdoor', 'tradeindia', 'yellowpages', 'startuplanes', 'fyple',
  'tuugo', 'cylex', 'storeboard', 'find-us-here', 'bizidex', 'directory'];
const REVIEW_HINTS = ['mouthshut', 'trustpilot', 'ambitionbox', 'g2', 'clutch', 'goodfirms', 'review'];

function classify(host) {
  const h = host.toLowerCase();
  if (DIRECTORY_HINTS.some(k => h.includes(k))) return 'directory';
  if (REVIEW_HINTS.some(k => h.includes(k))) return 'review';
  if (h.includes('blog') || h.includes('medium.com') || h.includes('wordpress')) return 'blog';
  return 'other';
}

// Rough "ease to acquire" score — directories/reviews are submittable (easy),
// editorial/other are harder. Higher = easier quick win.
function easeScore(type) {
  return { directory: 3, review: 2, blog: 1, other: 1 }[type] || 1;
}

class CompetitorBacklinks {
  constructor(config = {}) {
    this.braveKey = process.env.BRAVE_SEARCH_API_KEY;
    this.statePath = config.statePath || '../public/seo-reports/competitor-backlinks.json';
    const cfgPath = config.competitorsPath || path.join(__dirname, '../../config/competitors.json');
    this.cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  }

  async run() {
    console.log(chalk.bold.cyan('\n[ COMPETITOR BACKLINKS ] Citation / link-gap finder\n'));

    if (!this.braveKey) {
      console.log(chalk.yellow('  BRAVE_SEARCH_API_KEY not set — writing empty report. Add the key to enable discovery.'));
      this._write({ generatedAt: new Date().toISOString(), enabled: false, gap: [], competitors: [], stats: {} });
      return;
    }

    // 1. Discover referring hosts for own site + each competitor
    const ownHosts = await this._discover(this.cfg.own);
    console.log(chalk.gray(`  ${this.cfg.own.brand}: ${ownHosts.size} referring hosts found`));

    const compResults = [];
    const gapMap = new Map(); // host -> { citedBy:Set, type }
    for (const comp of this.cfg.competitors) {
      const hosts = await this._discover(comp);
      console.log(chalk.gray(`  ${comp.brand}: ${hosts.size} referring hosts found`));
      compResults.push({ domain: comp.domain, brand: comp.brand, referringHosts: [...hosts] });
      for (const h of hosts) {
        if (ownHosts.has(h)) continue;            // you already have it → not a gap
        if (!gapMap.has(h)) gapMap.set(h, { host: h, type: classify(h), citedBy: new Set() });
        gapMap.get(h).citedBy.add(comp.brand);
      }
    }

    // 2. Rank gap: more competitors citing it + easier to acquire = higher priority
    const gap = [...gapMap.values()]
      .map(g => ({
        host: g.host,
        type: g.type,
        citedBy: [...g.citedBy],
        competitorCount: g.citedBy.size,
        priority: g.citedBy.size * 10 + easeScore(g.type),
      }))
      .sort((a, b) => b.priority - a.priority);

    const stats = {
      ownReferringHosts: ownHosts.size,
      gapTotal: gap.length,
      gapDirectories: gap.filter(g => g.type === 'directory').length,
      gapReviews: gap.filter(g => g.type === 'review').length,
      sharedByAll: gap.filter(g => g.competitorCount === this.cfg.competitors.length).length,
    };

    this._write({
      generatedAt: new Date().toISOString(),
      enabled: true,
      own: this.cfg.own,
      competitors: compResults,
      gap,
      stats,
    });

    console.log(chalk.green(`\n  ✓ ${gap.length} link-gap opportunities found ` +
      `(${stats.gapDirectories} directories, ${stats.sharedByAll} cited by ALL competitors)`));
    console.log(chalk.bold('\n  Top 10 quick wins:'));
    gap.slice(0, 10).forEach((g, i) =>
      console.log(`   ${i + 1}. ${chalk.cyan(g.host)}  [${g.type}]  cited by ${g.competitorCount} competitor(s)`));
  }

  /** Discover candidate referring hosts for a target via Brave Search. */
  async _discover(target) {
    const hosts = new Set();
    const queries = [
      `"${target.domain}"`,                 // pages quoting the domain
      `"${target.brand}" Nagpur`,           // listings / mentions of the brand
      `${target.brand} digital marketing`,  // directory + review surfaces
    ];
    for (const q of queries) {
      const results = await this._brave(q);
      for (const url of results) {
        try {
          const host = new URL(url).host.replace(/^www\./, '').toLowerCase();
          if (!host) continue;
          if (host === target.domain.replace(/^www\./, '')) continue; // skip self
          if (NOISE_HOSTS.has(host)) continue;
          hosts.add(host);
        } catch (_) {}
      }
    }
    return hosts;
  }

  async _brave(query) {
    try {
      const q = encodeURIComponent(query);
      const res = await axios.get(`https://api.search.brave.com/res/v1/web/search?q=${q}&count=20`, {
        headers: { 'X-Subscription-Token': this.braveKey, 'Accept': 'application/json' },
        timeout: 15000,
      });
      return (res.data?.web?.results || []).map(r => r.url).filter(Boolean);
    } catch (e) {
      console.warn(chalk.yellow(`  Brave query failed (${query}): ${e.message}`));
      return [];
    }
  }

  _write(data) {
    const out = path.resolve(process.cwd(), this.statePath);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, JSON.stringify(data, null, 2));
    console.log(chalk.gray(`  → ${this.statePath}`));
  }
}

module.exports = { CompetitorBacklinks };
