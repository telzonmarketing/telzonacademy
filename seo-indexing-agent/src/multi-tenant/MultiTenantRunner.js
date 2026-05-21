'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { ClientRegistry } = require('./ClientRegistry');

/**
 * MultiTenantRunner — iterates through every active client and runs the
 * requested workflow (audit / heartbeat / aeo / blitz / backlinks) for each.
 *
 * One bug in a single client should NOT halt the entire batch — every
 * client's run is wrapped in its own try/catch. Failures are aggregated
 * into the master run summary at public/clients/run-summary.json.
 *
 * Each agent class accepts `{ siteUrl, outputDir, clientConfig }` so its
 * outputs land in the correct per-client folder.
 */
class MultiTenantRunner {
  constructor() {
    this.registry = new ClientRegistry();
  }

  /** Generic per-client iterator */
  async forEachClient(label, fn) {
    const clients = this.registry.loadAll();
    console.log(chalk.bold.cyan(`\n[ MULTI-TENANT ${label.toUpperCase()} ] ${clients.length} active client${clients.length === 1 ? '' : 's'}\n`));

    const summary = {
      label,
      timestamp: new Date().toISOString(),
      clients: [],
    };

    for (const client of clients) {
      // Skip clients where the requested feature is disabled
      const featureKey = label.endsWith('Enabled') ? label : `${label}Enabled`;
      if (client.features && client.features[featureKey] === false) {
        summary.clients.push({ slug: client.slug, status: 'skipped', reason: 'feature-disabled' });
        continue;
      }

      console.log(chalk.bold(`\n── ${client.name} (${client.slug}) ──`));
      fs.mkdirSync(client._outputDir, { recursive: true });

      try {
        const result = await fn(client);
        summary.clients.push({
          slug: client.slug,
          name: client.name,
          status: 'ok',
          result: result?.summary || null,
        });
        console.log(chalk.green(`  ✓ ${client.slug} complete`));
      } catch (err) {
        summary.clients.push({
          slug: client.slug,
          name: client.name,
          status: 'failed',
          error: err.message,
        });
        console.error(chalk.red(`  ✗ ${client.slug} failed: ${err.message}`));
      }
    }

    this._writeSummary(label, summary);
    return summary;
  }

  _writeSummary(label, summary) {
    const dir = path.resolve(__dirname, '../../../public/clients');
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `run-summary-${label}.json`);
    fs.writeFileSync(file, JSON.stringify(summary, null, 2));

    // Also append to the master run log
    const masterFile = path.join(dir, 'run-summary.json');
    let history = [];
    try {
      if (fs.existsSync(masterFile)) {
        history = JSON.parse(fs.readFileSync(masterFile, 'utf8'));
      }
    } catch (_) {}
    history.unshift(summary);
    fs.writeFileSync(masterFile, JSON.stringify(history.slice(0, 100), null, 2));
  }
}

module.exports = { MultiTenantRunner };
