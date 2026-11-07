#!/usr/bin/env node

'use strict';

require('dotenv').config();
const { program } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const { IndexingAgent } = require('./agents/IndexingAgent');

const banner = `
${chalk.bold.blue('╔══════════════════════════════════════════════════════╗')}
${chalk.bold.blue('║')}   ${chalk.bold.white('SEO Indexing Agent')} ${chalk.gray('— 99% Accuracy Crawler')}          ${chalk.bold.blue('║')}
${chalk.bold.blue('║')}   ${chalk.gray('Audit • Fix • Submit • Monitor any website')}          ${chalk.bold.blue('║')}
${chalk.bold.blue('╚══════════════════════════════════════════════════════╝')}
`;

console.log(banner);

program
  .name('seo-agent')
  .description('AI-powered SEO indexing agent — works on any website')
  .version('1.0.0');

program
  .command('audit')
  .description('Audit a website for indexing issues')
  .option('-u, --url <url>', 'Website URL to audit')
  .option('-g, --github <repo>', 'GitHub repo (owner/repo) to audit')
  .option('-o, --output <file>', 'Save report to file (json/html)', 'report.json')
  .option('--deep', 'Deep crawl (slower, more thorough)', false)
  .action(async (opts) => {
    const agent = new IndexingAgent({
      siteUrl: opts.url || process.env.SITE_URL,
      githubRepo: opts.github || process.env.GITHUB_REPO,
      deep: opts.deep,
    });
    await agent.audit(opts.output);
  });

program
  .command('fix')
  .description('Automatically generate fixes for indexing issues')
  .option('-u, --url <url>', 'Website URL')
  .option('-g, --github <repo>', 'GitHub repo to push fixes to')
  .option('--dry-run', 'Show what would be fixed without applying', false)
  .action(async (opts) => {
    const agent = new IndexingAgent({
      siteUrl: opts.url || process.env.SITE_URL,
      githubRepo: opts.github || process.env.GITHUB_REPO,
      dryRun: opts.dryRun,
    });
    await agent.fix();
  });

program
  .command('submit')
  .description('Submit all pages to Google Indexing API')
  .option('-u, --url <url>', 'Website URL')
  .option('--sitemap <url>', 'Sitemap URL to submit from')
  .option('--force', 'Re-submit already submitted pages', false)
  .action(async (opts) => {
    const agent = new IndexingAgent({
      siteUrl: opts.url || process.env.SITE_URL,
      sitemapUrl: opts.sitemap,
      forceResubmit: opts.force,
    });
    await agent.submit();
  });

program
  .command('monitor')
  .description('Continuously monitor indexing health')
  .option('-u, --url <url>', 'Website URL')
  .option('--interval <hours>', 'Check interval in hours', '24')
  .action(async (opts) => {
    const agent = new IndexingAgent({
      siteUrl: opts.url || process.env.SITE_URL,
      monitorInterval: parseInt(opts.interval) * 3600 * 1000,
    });
    await agent.monitor();
  });

program
  .command('mt-run')
  .description('Multi-tenant runner — loops through clients/*/config.json and runs the requested mode for each client')
  .option('-m, --mode <mode>', 'full | heartbeat | audit | submit | aeo | backlinks', 'full')
  .action(async (opts) => {
    const { MultiTenantRunner } = require('./multi-tenant/MultiTenantRunner');
    const { IndexingAgent } = require('./agents/IndexingAgent');
    const runner = new MultiTenantRunner();

    const { StrategyEngine } = require('./agents/StrategyEngine');

    await runner.forEachClient(opts.mode, async (client) => {
      const cfg = {
        siteUrl: client.site.url,
        githubRepo: process.env.GITHUB_REPO,
        githubToken: process.env.GH_TOKEN,
        clientSlug: client.slug,
        outputDir: client._outputDir,
      };
      const agent = new IndexingAgent(cfg);

      // Run the requested mode, then refresh the client's strategy.json from
      // whatever reports now exist. Strategy generation is deterministic and
      // soft-fails so it can never break a client's run.
      const refreshStrategy = () => {
        try {
          new StrategyEngine({ reportsDir: client._outputDir, siteUrl: client.site.url }).run();
        } catch (e) {
          console.warn(`  strategy refresh skipped for ${client.slug}: ${e.message}`);
        }
      };

      if (opts.mode === 'full')      { await agent.runFull(); return refreshStrategy(); }
      if (opts.mode === 'heartbeat') return agent.heartbeat();
      if (opts.mode === 'audit')     { await agent.audit(`${client._outputDir}/latest.json`); return refreshStrategy(); }
      if (opts.mode === 'submit')    return agent.submit();

      if (opts.mode === 'aeo') {
        const { AEOAgent } = require('./aeo/AEOAgent');
        await new AEOAgent({
          siteUrl: client.site.url,
          publicDir: `${client._outputDir}/..`,
          reportsDir: client._outputDir,
        }).run();
        return refreshStrategy();
      }

      if (opts.mode === 'backlinks') {
        const { BacklinkAgent } = require('./backlinks/BacklinkAgent');
        await new BacklinkAgent({
          siteUrl: client.site.url,
          statePath: `${client._outputDir}/backlinks.json`,
        }).run();
        return refreshStrategy();
      }

      throw new Error('Unsupported mode: ' + opts.mode);
    });
  });

program
  .command('backlinks')
  .description('Backlink agent — pre-filled submission packets for 24 directories + live tracking')
  .option('-u, --url <url>', 'Website URL')
  .action(async (opts) => {
    const { BacklinkAgent } = require('./backlinks/BacklinkAgent');
    const agent = new BacklinkAgent({ siteUrl: opts.url || process.env.SITE_URL });
    await agent.run();
  });

program
  .command('competitor-backlinks')
  .alias('complinks')
  .description('Competitor backlink / link-gap finder — citations to replicate (via Brave Search)')
  .action(async () => {
    const { CompetitorBacklinks } = require('./backlinks/CompetitorBacklinks');
    const agent = new CompetitorBacklinks();
    await agent.run();
  });

program
  .command('aeo')
  .description('AEO — Answer Engine Optimization for ChatGPT/Claude/Perplexity/Gemini')
  .option('-u, --url <url>', 'Website URL')
  .action(async (opts) => {
    const { AEOAgent } = require('./aeo/AEOAgent');
    const agent = new AEOAgent({
      siteUrl: opts.url || process.env.SITE_URL,
    });
    await agent.run();
  });

program
  .command('ai-monitor')
  .description('AI brain — analyse recent reports with Claude, surface bugs/anomalies/fixes')
  .action(async () => {
    const { AIMonitor } = require('./agents/AIMonitor');
    const monitor = new AIMonitor();
    try {
      await monitor.analyze();
    } catch (err) {
      console.error(chalk.red(`AI monitor failed: ${err.message}`));
      process.exit(0); // soft-fail — don't break workflow
    }
  });

program
  .command('strategy')
  .description('Strategy engine — derive a prioritized action plan + SEO Health Score from the latest reports')
  .option('-d, --dir <dir>', 'Reports directory to read/write', 'public/seo-reports')
  .option('-u, --url <url>', 'Website URL')
  .action(async (opts) => {
    const { StrategyEngine } = require('./agents/StrategyEngine');
    try {
      new StrategyEngine({
        reportsDir: opts.dir,
        siteUrl: opts.url || process.env.SITE_URL,
      }).run();
    } catch (err) {
      console.error(chalk.red(`Strategy engine failed: ${err.message}`));
      process.exit(0); // soft-fail — never break the daily workflow
    }
  });

program
  .command('schema-audit')
  .description('Crawl pages and validate JSON-LD — detects duplicate/invalid FAQ & schema (the GSC "invalid items" class)')
  .option('-d, --dir <dir>', 'Reports directory to write', 'public/seo-reports')
  .option('-u, --url <url>', 'Website URL')
  .option('-n, --max <n>', 'Max pages to audit', '60')
  .action(async (opts) => {
    const { StructuredDataAuditor } = require('./auditors/StructuredDataAuditor');
    try {
      await new StructuredDataAuditor({
        reportsDir: opts.dir,
        siteUrl: opts.url || process.env.SITE_URL,
        maxPages: parseInt(opts.max, 10) || 60,
      }).run();
    } catch (err) {
      console.error(chalk.red(`Schema audit failed: ${err.message}`));
      process.exit(0); // soft-fail — never break the daily workflow
    }
  });

program
  .command('heartbeat')
  .description('Hourly health check — fast probe of homepage, sitemap, robots, sample pages')
  .option('-u, --url <url>', 'Website URL')
  .option('-o, --output <file>', 'Save heartbeat result to file', 'heartbeat.json')
  .action(async (opts) => {
    const agent = new IndexingAgent({
      siteUrl: opts.url || process.env.SITE_URL,
    });
    const result = await agent.heartbeat();
    if (result) {
      require('fs').writeFileSync(opts.output, JSON.stringify(result, null, 2));
    }
  });

program
  .command('run')
  .description('Run full pipeline: audit → fix → submit (recommended)')
  .option('-u, --url <url>', 'Website URL')
  .option('-g, --github <repo>', 'GitHub repo')
  .option('--dry-run', 'Preview changes only', false)
  .action(async (opts) => {
    const agent = new IndexingAgent({
      siteUrl: opts.url || process.env.SITE_URL,
      githubRepo: opts.github || process.env.GITHUB_REPO,
      dryRun: opts.dryRun,
    });
    await agent.runFull();
  });

// Default: interactive mode if no command
if (process.argv.length === 2) {
  const { runInteractive } = require('./agents/InteractiveMode');
  runInteractive();
} else {
  program.parse(process.argv);
}
