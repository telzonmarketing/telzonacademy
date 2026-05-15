'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');

/**
 * AIMonitor — the "brain" layer that watches all the agent's output and
 * either fixes bugs autonomously or flags them with a precise diagnosis.
 *
 * Inputs (read from disk / GitHub):
 *   - public/seo-reports/latest.json     (most recent full audit)
 *   - public/seo-reports/history.json    (last 90 daily snapshots)
 *   - public/seo-reports/keywords.json   (keyword rankings + history)
 *   - public/seo-reports/activity.json   (audit trail)
 *   - public/seo-reports/heartbeat.json  (last health check)
 *   - recent workflow run errors (from $WORKFLOW_LOGS env if available)
 *
 * Output: public/seo-reports/ai-insights.json — bugs, anomalies, recs,
 * and auto-fixable code patches.
 */
class AIMonitor {
  constructor(config = {}) {
    this.apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;
    this.model  = config.model  || 'claude-sonnet-4-5';
    this.reportsDir = config.reportsDir || 'public/seo-reports';
  }

  async analyze() {
    if (!this.apiKey) {
      console.log('  No ANTHROPIC_API_KEY set — skipping AI monitor');
      return null;
    }

    const ctx = this._gatherContext();
    if (!ctx.latest) {
      console.log('  No reports to analyse yet');
      return null;
    }

    const prompt = this._buildPrompt(ctx);
    console.log('  Calling Claude to analyse SEO agent output...');
    const response = await this._callClaude(prompt);
    const parsed = this._parseResponse(response);

    parsed.timestamp   = new Date().toISOString();
    parsed.modelUsed   = this.model;
    parsed.dataPoints  = ctx.dataPoints;

    fs.writeFileSync(
      path.join(this.reportsDir, 'ai-insights.json'),
      JSON.stringify(parsed, null, 2)
    );

    console.log(`  ✓ AI analysis: ${parsed.bugs?.length || 0} bugs, ${parsed.anomalies?.length || 0} anomalies, ${parsed.recommendations?.length || 0} recommendations`);
    return parsed;
  }

  _gatherContext() {
    const read = (f) => {
      const p = path.join(this.reportsDir, f);
      if (!fs.existsSync(p)) return null;
      try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
    };

    const latest    = read('latest.json');
    const history   = read('history.json') || [];
    const keywords  = read('keywords.json');
    const activity  = read('activity.json') || [];
    const heartbeat = read('heartbeat.json');

    return {
      latest, history, keywords, activity, heartbeat,
      dataPoints: {
        historyEntries: history.length,
        activityEntries: activity.length,
        keywordsTracked: keywords?.latest?.length || 0,
      },
    };
  }

  _buildPrompt(ctx) {
    // Truncate to keep token cost reasonable — last 14 days of history,
    // last 30 activities, top 30 keywords
    const trimmed = {
      latestSummary:      ctx.latest?.summary || {},
      latestIssues:       (ctx.latest?.issues || []).slice(0, 10),
      latestFixes:        (ctx.latest?.fixes  || []).slice(0, 10),
      latestErrors:       ctx.latest?.errors  || [],
      historyLast14:      ctx.history.slice(0, 14),
      keywordSummary:     ctx.keywords?.summary || {},
      keywordsTop30:      (ctx.keywords?.latest || []).slice(0, 30).map(k => ({
        q: k.query, pos: k.position, imp: k.impressions, clicks: k.clicks, change: k.change,
      })),
      keywordHistoryLast14: (ctx.keywords?.history || []).slice(0, 14),
      activityLast30:     ctx.activity.slice(0, 30).map(a => ({
        t: a.timestamp, type: a.type, title: a.title,
      })),
      lastHeartbeat:      ctx.heartbeat,
    };

    return `You are the AI brain monitoring an automated SEO agent that runs 24/7 on telzonacademy.in.

The agent has these continuous functions:
- Hourly heartbeat (site health check across homepage, sitemap, robots, sample pages)
- 5x/day page submissions to Google Indexing API (auto-rate-limited at 200/day Google quota)
- Daily full audit: crawl → fix issues (auto-commits to GitHub) → submit → track keyword rankings via GSC → generate content briefs for "almost page 1" keywords

YOUR JOB: Review the agent's recent output and tell me:
1. **bugs** — actual broken behavior (workflow failures, parsing errors, regressions). Be specific.
2. **anomalies** — unexpected metric movements (sudden ranking drops, crawl count drop, heartbeat failures, etc.)
3. **recommendations** — concrete high-impact actions the agent or owner should take next
4. **codeFixes** — when you can pinpoint a code bug, return file path + diff. Only include if confident.

DATA:
\`\`\`json
${JSON.stringify(trimmed, null, 2)}
\`\`\`

Respond with valid JSON only (no markdown, no prose), matching this schema:
{
  "summary": "1-2 sentence top-line assessment of system health",
  "healthScore": 0-100,
  "bugs": [
    { "severity": "critical|high|medium|low", "title": "...", "details": "...", "evidence": "..." }
  ],
  "anomalies": [
    { "metric": "...", "observation": "...", "likelyCause": "..." }
  ],
  "recommendations": [
    { "priority": "high|medium|low", "action": "...", "expectedImpact": "..." }
  ],
  "codeFixes": [
    { "file": "path/to/file", "issue": "...", "suggestedChange": "..." }
  ]
}`;
  }

  _callClaude(prompt) {
    const body = JSON.stringify({
      model: this.model,
      max_tokens: 2500,
      messages: [{ role: 'user', content: prompt }],
    });

    return new Promise((resolve, reject) => {
      const req = https.request({
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Length': Buffer.byteLength(body),
        },
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode !== 200) {
            return reject(new Error(`Claude API ${res.statusCode}: ${data}`));
          }
          try { resolve(JSON.parse(data)); }
          catch (e) { reject(e); }
        });
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }

  _parseResponse(apiResponse) {
    const text = apiResponse?.content?.[0]?.text || '';
    // Try direct parse; fall back to extracting first {...} block
    try { return JSON.parse(text); }
    catch (_) {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        try { return JSON.parse(match[0]); }
        catch (_) {}
      }
      return {
        summary: 'AI returned unparseable response',
        healthScore: null,
        bugs: [], anomalies: [], recommendations: [], codeFixes: [],
        raw: text.slice(0, 1000),
      };
    }
  }
}

module.exports = { AIMonitor };
