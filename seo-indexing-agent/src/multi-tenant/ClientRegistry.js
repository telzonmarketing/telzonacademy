'use strict';

const fs = require('fs');
const path = require('path');

/**
 * ClientRegistry — discovers and loads every client config from /clients/
 * at the repo root. Used by workflows + every agent to iterate per-client.
 *
 * Folder layout:
 *   clients/
 *     _template/      (skipped — onboarding template only)
 *     telzonacademy/  config.json
 *     client-a/       config.json
 *     client-b/       config.json
 *
 * Skips: directories starting with `_` (templates, archive, etc.)
 * Skips: clients with active === false in their config
 */
class ClientRegistry {
  constructor(options = {}) {
    this.clientsDir = options.clientsDir || path.resolve(__dirname, '../../../clients');
  }

  /** Return array of active client configs */
  loadAll() {
    if (!fs.existsSync(this.clientsDir)) return [];
    const entries = fs.readdirSync(this.clientsDir, { withFileTypes: true });
    const clients = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (entry.name.startsWith('_')) continue;
      if (entry.name.startsWith('.')) continue;

      const configPath = path.join(this.clientsDir, entry.name, 'config.json');
      if (!fs.existsSync(configPath)) continue;

      try {
        const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (cfg.active === false) continue;
        // Sanity check required fields
        if (!cfg.slug || !cfg.site?.url) continue;
        // Ensure slug matches folder name
        cfg.slug = entry.name;
        // Computed convenience fields
        cfg._configPath = configPath;
        cfg._outputDir = path.resolve(__dirname, '../../../public/clients', entry.name, 'seo-reports');
        clients.push(cfg);
      } catch (err) {
        console.warn(`[ClientRegistry] Skipped ${entry.name}: ${err.message}`);
      }
    }

    return clients;
  }

  /** Load a single client by slug */
  load(slug) {
    return this.loadAll().find(c => c.slug === slug);
  }

  /** Summary for logs */
  summary() {
    const all = this.loadAll();
    return {
      total: all.length,
      slugs: all.map(c => c.slug),
    };
  }

  /**
   * Resolve a credential secret name into an actual env-var value.
   * In workflows, secrets are exposed as env vars by the same name.
   */
  resolveCredential(config, key) {
    const secretName = config.credentials?.[key];
    if (!secretName) return null;
    return process.env[secretName] || null;
  }
}

module.exports = { ClientRegistry };
