'use strict';

const chalk = require('chalk');
const ora = require('ora');
const { SiteCrawler } = require('../auditors/SiteCrawler');
const { IndexingAuditor } = require('../auditors/IndexingAuditor');
const { RobotsAuditor } = require('../auditors/RobotsAuditor');
const { SitemapAuditor } = require('../auditors/SitemapAuditor');
const { MetaAuditor } = require('../auditors/MetaAuditor');
const { GitHubConnector } = require('../utils/GitHubConnector');
const { GoogleSearchConsole } = require('../submitters/GoogleSearchConsole');
const { IndexingAPISubmitter } = require('../submitters/IndexingAPISubmitter');
const { IndexNowSubmitter } = require('../submitters/IndexNowSubmitter');
const { IssueFixer } = require('../fixers/IssueFixer');
const { Reporter } = require('../utils/Reporter');
const { KeywordTracker } = require('../trackers/KeywordTracker');
const { HealthChecker } = require('../auditors/HealthChecker');
const { BrokenLinkChecker } = require('../auditors/BrokenLinkChecker');
const { ContentBriefGenerator } = require('../auditors/ContentBriefGenerator');

class IndexingAgent {
  constructor(config = {}) {
    this.config = {
      siteUrl: config.siteUrl,
      githubRepo: config.githubRepo || process.env.GITHUB_REPO,
      githubToken: config.githubToken || process.env.GITHUB_TOKEN,
      githubBranch: config.githubBranch || process.env.GITHUB_BRANCH || 'main',
      maxPages: config.maxPages || parseInt(process.env.MAX_CRAWL_PAGES) || 1000,
      crawlDelay: config.crawlDelay || parseInt(process.env.CRAWL_DELAY_MS) || 500,
      autoSubmit: config.autoSubmit !== false,
      dryRun: config.dryRun || false,
      deep: config.deep || false,
      forceResubmit: config.forceResubmit || false,
      monitorInterval: config.monitorInterval || 24 * 3600 * 1000,
    };

    this.results = {
      pagesFound: 0,
      issuesFound: [],
      issuesFixed: [],
      pagesSubmitted: [],
      keywords: [],
      keywordSummary: {},
      brokenLinks: [],
      contentBriefs: [],
      healthCheck: null,
      errors: [],
    };
  }

  /**
   * Heartbeat: hourly lightweight check — homepage, sitemap, robots, sample
   * pages. Fast (<30s), used to fill the activity feed with "still alive"
   * pings between heavy daily audits.
   */
  async heartbeat() {
    if (!this.config.siteUrl) return null;
    const checker = new HealthChecker(this.config);
    const result = await checker.check(this.config.siteUrl);
    this.results.healthCheck = result;
    console.log(chalk.bold(`\n[ HEARTBEAT ] ${result.healthy ? '✓ Healthy' : '⚠ Issues detected'}`));
    console.log(`  ${result.passed}/${result.totalChecks} checks passed · avg ${result.avgResponseMs}ms`);
    if (result.failed > 0) {
      console.log(chalk.yellow(`  Failed:`));
      for (const r of result.results.filter(x => !x.ok)) {
        console.log(chalk.yellow(`    ${r.status || 'ERR'}  ${r.name}`));
      }
    }
    return result;
  }

  async audit(outputFile = 'report.json') {
    console.log(chalk.bold('\n[ PHASE 1 ] Auditing website for indexing issues\n'));

    if (!this.config.siteUrl && !this.config.githubRepo) {
      console.error(chalk.red('Error: Provide --url or --github'));
      process.exit(1);
    }

    const spinner = ora('Initialising crawl...').start();

    try {
      // Step 1: Crawl the site
      spinner.text = 'Crawling website pages...';
      const crawler = new SiteCrawler(this.config);
      const pages = await crawler.crawl(this.config.siteUrl);
      this.results.pagesFound = pages.length;
      spinner.succeed(`Found ${chalk.bold(pages.length)} pages`);

      // Step 2: If GitHub repo provided, also pull source files
      let sourceFiles = null;
      if (this.config.githubRepo) {
        spinner.start('Connecting to GitHub repo...');
        const github = new GitHubConnector(this.config.githubToken);
        sourceFiles = await github.getRepoFiles(this.config.githubRepo, this.config.githubBranch);
        spinner.succeed(`Loaded ${chalk.bold(Object.keys(sourceFiles).length)} source files from GitHub`);
      }

      // Step 3: Run all auditors in parallel
      spinner.start('Running indexing audit (robots, sitemap, meta, rendering)...');
      const [robotsIssues, sitemapIssues, metaIssues, indexingIssues] = await Promise.all([
        new RobotsAuditor(this.config).audit(this.config.siteUrl, pages),
        new SitemapAuditor(this.config).audit(this.config.siteUrl, pages),
        new MetaAuditor(this.config).audit(pages),
        new IndexingAuditor(this.config).audit(pages, sourceFiles),
      ]);

      this.results.issuesFound = [
        ...robotsIssues,
        ...sitemapIssues,
        ...metaIssues,
        ...indexingIssues,
      ];

      // Step 3b: Broken link detection (runs only on deep / full audits)
      spinner.start('Scanning internal & external links for 4xx/5xx...');
      try {
        const linkChecker = new BrokenLinkChecker(this.config);
        const { broken, summaries } = await linkChecker.check(pages);
        this.results.brokenLinks = broken;
        this.results.issuesFound.push(...summaries);
        spinner.succeed(`Link check complete — ${chalk.bold(broken.length)} broken link${broken.length === 1 ? '' : 's'} found`);
      } catch (err) {
        spinner.warn(`Link check skipped: ${err.message}`);
      }

      spinner.succeed(`Audit complete — ${chalk.bold(this.results.issuesFound.length)} issues found`);

      // Step 4: Generate report
      const reporter = new Reporter();
      await reporter.save(this.results, outputFile);
      reporter.printSummary(this.results);

      return this.results;

    } catch (err) {
      spinner.fail(`Audit failed: ${err.message}`);
      this.results.errors.push(err.message);
      throw err;
    }
  }

  async fix() {
    console.log(chalk.bold('\n[ PHASE 2 ] Auto-generating fixes\n'));

    // First audit if we haven't
    if (this.results.issuesFound.length === 0) {
      await this.audit();
    }

    const fixer = new IssueFixer(this.config);
    const fixes = await fixer.fix(this.results.issuesFound);

    if (this.config.dryRun) {
      console.log(chalk.yellow('\nDry run — no changes applied. Showing fixes:\n'));
      fixes.forEach(f => {
        console.log(chalk.bold(f.issue));
        console.log(chalk.gray(f.description));
        if (f.code) console.log(chalk.cyan(f.code));
        console.log();
      });
      return;
    }

    // Push fixes to GitHub if repo provided
    if (this.config.githubRepo && fixes.some(f => f.fileChange)) {
      const spinner = ora('Pushing fixes to GitHub...').start();
      const github = new GitHubConnector(this.config.githubToken);
      for (const fix of fixes.filter(f => f.fileChange)) {
        await github.pushFile(
          this.config.githubRepo,
          fix.fileChange.path,
          fix.fileChange.content,
          `fix(seo): ${fix.issue}`,
          this.config.githubBranch
        );
      }
      spinner.succeed(`Pushed ${fixes.filter(f => f.fileChange).length} fixes to GitHub`);
    }

    this.results.issuesFixed = fixes;
    return fixes;
  }

  async submit() {
    console.log(chalk.bold('\n[ PHASE 3 ] Submitting pages to Google\n'));

    const spinner = ora('Discovering pages to submit...').start();

    let pagesToSubmit = [];

    // Get pages from sitemap or crawl
    if (this.config.sitemapUrl) {
      const sitemapAuditor = new SitemapAuditor(this.config);
      pagesToSubmit = await sitemapAuditor.getUrlsFromSitemap(this.config.sitemapUrl);
    } else {
      const crawler = new SiteCrawler(this.config);
      const pages = await crawler.crawl(this.config.siteUrl);
      pagesToSubmit = pages.map(p => p.url);
    }

    spinner.succeed(`Found ${chalk.bold(pagesToSubmit.length)} pages to submit`);

    // Submit via Google Indexing API
    const submitter = new IndexingAPISubmitter();
    const results = await submitter.submitBatch(pagesToSubmit, this.config.forceResubmit);

    this.results.pagesSubmitted = results.submitted;

    console.log(chalk.green(`\n✓ Submitted ${results.submitted.length} pages to Google`));
    if (results.failed.length > 0) {
      console.log(chalk.yellow(`  ${results.failed.length} pages failed — check report for details`));
    }

    // Also submit via IndexNow → Bing, Yandex, Naver, Seznam, Yep (free, instant)
    console.log(chalk.cyan('\n  Notifying Bing/Yandex via IndexNow...'));
    try {
      const indexNow = new IndexNowSubmitter(this.config);
      const inResult = await indexNow.submitBatch(pagesToSubmit);
      this.results.indexNow = inResult;
      if (inResult.submitted > 0) {
        console.log(chalk.green(`  ✓ IndexNow: ${inResult.note}`));
      } else {
        console.log(chalk.yellow(`  ⚠ IndexNow: ${inResult.note || 'unknown error'}`));
      }
    } catch (err) {
      console.log(chalk.yellow(`  IndexNow skipped: ${err.message}`));
    }

    return results;
  }

  async rankKeywords(previousKeywords = []) {
    if (!this.config.siteUrl) return;
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH && !process.env.GOOGLE_SERVICE_ACCOUNT_KEY) return;

    console.log(chalk.bold('\n[ PHASE 4 ] Tracking keyword rankings\n'));
    const spinner = ora('Fetching keyword positions from Google Search Console...').start();

    try {
      const tracker = new KeywordTracker(this.config);
      const { keywords, summary } = await tracker.track(this.config.siteUrl, previousKeywords);
      this.results.keywords = keywords;
      this.results.keywordSummary = summary;

      if (summary.total > 0) {
        spinner.succeed(`Tracked ${chalk.bold(summary.total)} keywords — avg position: ${chalk.bold(summary.avgPosition)}`);
        if (summary.improved > 0) console.log(chalk.green(`  ↑ ${summary.improved} keywords improved`));
        if (summary.dropped > 0)  console.log(chalk.yellow(`  ↓ ${summary.dropped} keywords dropped`));
        if (summary.opportunities.length > 0) {
          console.log(chalk.cyan(`  🎯 ${summary.opportunities.length} keywords almost on page 1 (pos 11–20)`));
        }
      } else {
        spinner.warn('No keyword data yet — GSC needs 2–3 days to populate after connecting');
      }
    } catch (err) {
      spinner.warn(`Keyword tracking skipped: ${err.message}`);
    }
  }

  async runFull() {
    console.log(chalk.bold.green('\nRunning full pipeline: Audit → Fix → Submit → Rank\n'));
    console.log(chalk.gray('─'.repeat(56)));

    await this.audit('full-report.json');
    console.log(chalk.gray('─'.repeat(56)));

    const criticalIssues = this.results.issuesFound.filter(i => i.severity === 'critical');
    if (criticalIssues.length > 0) {
      console.log(chalk.yellow(`\nFound ${criticalIssues.length} critical issues — fixing before submission\n`));
      await this.fix();
    }
    console.log(chalk.gray('─'.repeat(56)));

    if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH || process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      await this.submit();
    } else {
      console.log(chalk.yellow('\nSkipping submission: Google credentials not configured'));
      console.log(chalk.gray('Add GOOGLE_SERVICE_ACCOUNT_KEY_PATH to .env to enable auto-submission\n'));
    }

    // Phase 4: keyword rank tracking (load previous snapshot for change detection)
    let previousKeywords = [];
    try {
      const fs = require('fs');
      if (fs.existsSync('keywords-snapshot.json')) {
        previousKeywords = JSON.parse(fs.readFileSync('keywords-snapshot.json', 'utf8'));
      }
    } catch (_) {}
    await this.rankKeywords(previousKeywords);

    // Phase 5: Content briefs — turn keyword opportunities into action items
    if (this.results.keywords.length > 0) {
      console.log(chalk.bold('\n[ PHASE 5 ] Generating content optimisation briefs\n'));
      const generator = new ContentBriefGenerator(this.config);
      const { briefs, total } = generator.generate(this.results.keywords);
      this.results.contentBriefs = briefs;
      console.log(chalk.green(`  ✓ Generated ${briefs.length} content briefs (${total} keywords eligible)`));
      if (briefs.length > 0) {
        console.log(chalk.cyan(`  Top opportunity: "${briefs[0].query}" at #${briefs[0].currentPosition} — +${briefs[0].estimatedTrafficGain} clicks/mo potential`));
      }
    }

    // Save new keyword snapshot for next run's change detection
    if (this.results.keywords.length > 0) {
      try {
        const fs = require('fs');
        fs.writeFileSync('keywords-snapshot.json', JSON.stringify(this.results.keywords, null, 2));
      } catch (_) {}
    }

    // Save the full report including keywords
    const reporter = new Reporter();
    await reporter.save(this.results, 'full-report.json');

    console.log(chalk.bold.green('\n✓ Full pipeline complete!\n'));
  }

  async monitor() {
    console.log(chalk.bold('\n[ MONITOR ] Watching indexing health\n'));
    console.log(chalk.gray(`Checking every ${this.config.monitorInterval / 3600000}h\n`));

    const runCheck = async () => {
      const timestamp = new Date().toISOString();
      console.log(chalk.gray(`[${timestamp}] Running health check...`));

      try {
        await this.runFull();
        const healthy = this.results.issuesFound.filter(i => i.severity === 'critical').length === 0;
        console.log(healthy
          ? chalk.green(`[${timestamp}] Site is healthy`)
          : chalk.red(`[${timestamp}] ${this.results.issuesFound.length} issues detected`)
        );
      } catch (err) {
        console.error(chalk.red(`[${timestamp}] Check failed: ${err.message}`));
      }
    };

    await runCheck();
    setInterval(runCheck, this.config.monitorInterval);
  }
}

module.exports = { IndexingAgent };
