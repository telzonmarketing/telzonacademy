#!/usr/bin/env node
'use strict';

/**
 * Copies each client's config.json from clients/<slug>/ to
 * public/clients/<slug>/config.json so the dashboard can fetch it.
 * Strips sensitive fields (passwords are kept — they're used by the
 * client-side login gate, but credentials block is NOT public).
 *
 * Run by the multi-tenant workflow on every cron.
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '../..');
const clientsDir = path.join(repoRoot, 'clients');
const outDir = path.join(repoRoot, 'public', 'clients');

if (!fs.existsSync(clientsDir)) {
  console.error('clients/ not found at ' + clientsDir);
  process.exit(0);
}

const directory = [];

for (const entry of fs.readdirSync(clientsDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
  const cfgPath = path.join(clientsDir, entry.name, 'config.json');
  if (!fs.existsSync(cfgPath)) continue;

  try {
    const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
    if (cfg.active === false) continue;

    // Public-safe shape — strip credentials block, keep password gate
    const pub = {
      slug:        cfg.slug || entry.name,
      name:        cfg.name,
      site:        cfg.site,
      branding:    cfg.branding,
      features:    cfg.features,
      onboardedAt: cfg.onboardedAt,
      access: {
        dashboardPassword: cfg.access?.dashboardPassword || null,
      },
    };

    const outClientDir = path.join(outDir, entry.name);
    fs.mkdirSync(outClientDir, { recursive: true });
    fs.writeFileSync(path.join(outClientDir, 'config.json'), JSON.stringify(pub, null, 2));
    fs.mkdirSync(path.join(outClientDir, 'seo-reports'), { recursive: true });

    directory.push({ slug: pub.slug, name: pub.name, site: pub.site.url });
    console.log(`✓ Synced ${pub.slug}`);
  } catch (err) {
    console.warn(`⚠ Skipped ${entry.name}: ${err.message}`);
  }
}

// Master directory file used by the admin overview at /clients/admin/
fs.writeFileSync(path.join(outDir, 'directory.json'), JSON.stringify({
  updatedAt: new Date().toISOString(),
  clients: directory,
}, null, 2));

console.log(`\n${directory.length} client(s) synced to public/clients/`);
