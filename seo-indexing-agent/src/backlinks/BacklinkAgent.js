'use strict';

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const { NAPProfile } = require('./NAPProfile');
const { DIRECTORIES } = require('./DirectoryRegistry');

/**
 * BacklinkAgent — generates pre-filled submission packets for 24 curated
 * directories, tracks submission state, and monitors which listings stay
 * live week-over-week.
 *
 * Output: public/seo-reports/backlinks.json  →  dashboard renders it.
 *
 * Lifecycle per directory:
 *   - pending   : not submitted yet — packet ready, user clicks submit
 *   - submitted : user marked submitted, awaiting listing-live verify
 *   - live      : found a "Telzon Academy" hit on that directory's domain
 *   - broken    : listing was live, now 404/missing — needs fixing
 */
class BacklinkAgent {
  constructor(config = {}) {
    this.config = config;
    this.siteUrl = config.siteUrl || 'https://telzonacademy.in';
    this.statePath = config.statePath || '../public/seo-reports/backlinks.json';
    this.profile = new NAPProfile().get();
    this.braveKey = process.env.BRAVE_SEARCH_API_KEY;
  }

  async run() {
    console.log(chalk.bold.magenta('\n[ BACKLINKS ] Directory + citation submission packet builder\n'));

    const state = this._loadState();

    // 1. Build a packet for every directory
    const packets = DIRECTORIES.map(dir => this._buildPacket(dir, state.directories[dir.key]));

    // 2. Live-verify each entry (Brave Search if available, else skip)
    for (const packet of packets) {
      if (packet.status !== 'pending' && this.braveKey) {
        const isLive = await this._verifyLive(packet);
        if (isLive && packet.status !== 'live') {
          packet.status = 'live';
          packet.verifiedAt = new Date().toISOString();
        } else if (!isLive && packet.status === 'live') {
          packet.status = 'broken';
          packet.brokenAt = new Date().toISOString();
        }
      }
    }

    // 3. Stats
    const stats = {
      total:      packets.length,
      pending:    packets.filter(p => p.status === 'pending').length,
      submitted:  packets.filter(p => p.status === 'submitted').length,
      live:       packets.filter(p => p.status === 'live').length,
      broken:     packets.filter(p => p.status === 'broken').length,
      tier1Live:  packets.filter(p => p.tier === 1 && p.status === 'live').length,
    };

    const report = {
      timestamp: new Date().toISOString(),
      siteUrl: this.siteUrl,
      profile: {
        name: this.profile.name,
        phone: this.profile.phone,
        email: this.profile.email,
        address: `${this.profile.city}, ${this.profile.state} ${this.profile.pincode}`,
      },
      stats,
      directories: packets,
      nextActions: this._nextActions(packets),
    };

    fs.mkdirSync(path.dirname(this.statePath), { recursive: true });
    fs.writeFileSync(this.statePath, JSON.stringify(report, null, 2));

    console.log(`  Tier-1 live: ${chalk.bold(stats.tier1Live)}/5`);
    console.log(`  Total live:  ${chalk.bold(stats.live)}/${stats.total}`);
    console.log(`  Pending:     ${chalk.yellow(stats.pending)}`);
    console.log(`  Broken:      ${stats.broken > 0 ? chalk.red(stats.broken) : '0'}`);
    console.log(`\n  Next 3 actions:`);
    report.nextActions.slice(0, 3).forEach((a, i) => {
      console.log(`    ${i + 1}. Submit to ${chalk.cyan(a.name)}  →  ${a.submissionUrl}`);
    });

    return report;
  }

  _loadState() {
    try {
      if (fs.existsSync(this.statePath)) {
        const prev = JSON.parse(fs.readFileSync(this.statePath, 'utf8'));
        const byKey = {};
        for (const d of (prev.directories || [])) byKey[d.key] = d;
        return { directories: byKey };
      }
    } catch (_) {}
    return { directories: {} };
  }

  _buildPacket(directory, prior) {
    const profile = new NAPProfile().forDirectory(directory.key);
    return {
      key:           directory.key,
      name:          directory.name,
      tier:          directory.tier,
      region:        directory.region,
      submissionUrl: directory.submissionUrl,
      notes:         directory.notes,
      status:        prior?.status || 'pending',
      submittedAt:   prior?.submittedAt || null,
      verifiedAt:    prior?.verifiedAt || null,
      brokenAt:      prior?.brokenAt || null,
      listingUrl:    prior?.listingUrl || null,
      packet: {
        name:        profile.name,
        phone:       profile.phone,
        email:       profile.email,
        website:     profile.website,
        address:     profile.address,
        city:        profile.city,
        state:       profile.state,
        pincode:     profile.pincode,
        category:    profile.category,
        description: profile.description,
        keywords:    profile.keywords,
        logo:        profile.logo,
      },
    };
  }

  async _verifyLive(packet) {
    if (!this.braveKey || !packet.submissionUrl) return false;
    try {
      const host = new URL(packet.submissionUrl).host.replace(/^www\./, '');
      const q = encodeURIComponent(`"Telzon Academy" site:${host}`);
      const res = await axios.get(`https://api.search.brave.com/res/v1/web/search?q=${q}&count=5`, {
        headers: { 'X-Subscription-Token': this.braveKey, 'Accept': 'application/json' },
        timeout: 15000,
      });
      const hits = res.data?.web?.results || [];
      if (hits.length > 0) {
        packet.listingUrl = hits[0].url;
        return true;
      }
    } catch (_) {}
    return false;
  }

  _nextActions(packets) {
    return packets
      .filter(p => p.status === 'pending')
      .sort((a, b) => a.tier - b.tier)
      .map(p => ({
        key: p.key, name: p.name, tier: p.tier,
        submissionUrl: p.submissionUrl, notes: p.notes,
      }));
  }
}

module.exports = { BacklinkAgent };
