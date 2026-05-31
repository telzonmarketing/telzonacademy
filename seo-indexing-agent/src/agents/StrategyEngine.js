'use strict';

const fs = require('fs');
const path = require('path');

/**
 * StrategyEngine v2 — the deterministic "what should we do next" brain.
 *
 * Unlike AIMonitor (which calls Claude and needs an API key), this is a pure
 * rules engine: it reads the agent's own report JSONs and derives a prioritized
 * action plan + a 0-100 SEO Health Score. It runs reliably on every daily pass
 * with zero external dependencies, and persists the result so the dashboard can
 * display the same strategy the agent reasoned about.
 *
 * v2 adds: a much deeper knowledge base of rules (local/GBP, reviews, schema,
 * CTR, E-E-A-T, content freshness, featured snippets), per-action time-to-impact
 * ETAs, impact×effort scoring for smarter ordering, and momentum/trend awareness
 * derived from history.json.
 *
 * Inputs (from reportsDir):
 *   latest.json, history.json, keywords.json, backlinks.json, aeo-report.json
 * Output:
 *   <reportsDir>/strategy.json
 */
class StrategyEngine {
  constructor(config = {}) {
    this.reportsDir = config.reportsDir || 'public/seo-reports';
    this.siteUrl = config.siteUrl || process.env.SITE_URL || '';
    this.region = config.region || 'Nagpur-area'; // local-SEO flavour text
    this.business = config.business || 'academy';  // tunes schema/content advice
  }

  run() {
    const read = (f) => {
      const p = path.join(this.reportsDir, f);
      if (!fs.existsSync(p)) return null;
      try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
    };

    const report = read('latest.json') || {};
    const kwData = read('keywords.json');
    const bl = read('backlinks.json');
    const aeo = read('aeo-report.json');
    const history = read('history.json') || [];
    const schemaAudit = read('schema-audit.json');

    const strategy = this.compute(report, kwData, bl, aeo, history, schemaAudit);

    if (!fs.existsSync(this.reportsDir)) fs.mkdirSync(this.reportsDir, { recursive: true });
    fs.writeFileSync(
      path.join(this.reportsDir, 'strategy.json'),
      JSON.stringify(strategy, null, 2)
    );

    const p1 = strategy.recommendations.filter((r) => r.prio === 1 && !r.done).length;
    console.log(`  ✓ Strategy v2: health ${strategy.healthScore}/100 (${strategy.grade}), ${strategy.recommendations.length} actions (${p1} high-priority)`);
    return strategy;
  }

  /**
   * Pure function: report data in → strategy object out. No filesystem access.
   */
  compute(report, kwData, bl, aeo, history, schemaAudit) {
    report = report || {};
    const s = report.summary || {};
    const ks = report.keywordSummary || (kwData && kwData.summary) || {};
    const blStats = (bl && bl.stats) || {};
    const aeoVis = (aeo && aeo.visibility) || {};
    const keywords = (kwData && kwData.latest) || report.keywords || [];

    const kwTotal = s.totalKeywords || keywords.length || 0;
    const avgPos = s.avgPosition;
    const critical = s.critical || 0;
    const broken = (report.brokenLinks || []).length;
    const submitted = s.pagesSubmitted || 0;
    const pages = s.pagesFound || 0;
    const opps = (ks.opportunities || []).filter((k) => k.position >= 11 && k.position <= 20);
    const aeoScore = aeo && typeof aeo.score === 'number' ? aeo.score : null;
    const aeoCited = aeoVis.citingCount || 0;
    const aeoChecked = aeoVis.checked || 0;
    const tier1Live = blStats.tier1Live || 0;
    const liveCites = blStats.live || 0;
    const pendingCites = blStats.pending || 0;
    const totalCites = blStats.total || 0;
    const gscConnected = kwTotal > 0;

    // Keyword-derived opportunities (only when GSC data is flowing)
    const lowCtr = keywords.filter((k) => (k.impressions || 0) >= 50 && (k.position || 99) <= 10 && (k.ctr || 0) < 2);
    const page1NotTop3 = keywords.filter((k) => (k.position || 99) >= 4 && (k.position || 99) <= 10);

    // ── scoring helper: impact × effort-ease → 1..9, for ordering within a tier ──
    const scoreOf = (impact, effort) => {
      const im = { high: 3, med: 2, low: 1 }[impact] || 2;
      const ef = { low: 3, med: 2, high: 1 }[effort] || 2; // low effort = easier = higher
      return im * ef;
    };

    const recs = [];
    const add = (r) => { r.score = scoreOf(r.impact, r.effort); recs.push(r); };

    // ════════════════ LOCAL SEO / GOOGLE BUSINESS PROFILE ════════════════
    if (tier1Live < 5 && totalCites > 0) {
      add({
        prio: 1, cat: 'Local SEO', icon: '📍', impact: 'high', effort: 'low', timeToImpact: '4–8 weeks',
        title: `Claim your Tier-1 local citations (${tier1Live}/5 live)`,
        why: `Google Business Profile alone is ~32% of local-pack ranking, yet ${pendingCites} of your ${totalCites} citations are still pending. Highest-leverage move for a ${this.region} ${this.business}.`,
        action: 'Open the Backlink Agent → submit Google Business Profile, Bing Places & JustDial first with byte-for-byte identical NAP.',
      });
    } else if (liveCites < totalCites && totalCites > 0) {
      add({
        prio: 2, cat: 'Local SEO', icon: '📍', impact: 'high', effort: 'med', timeToImpact: '1–3 months',
        title: `Finish the remaining ${totalCites - liveCites} directory citations`,
        why: 'NAP consistency across 30–50 directories is what makes Google trust your location. Missing/inconsistent citations suppress map-pack rankings.',
        action: 'Work through the Backlink Agent packets — keep Name/Address/Phone identical everywhere.',
      });
    }

    // GBP ongoing optimization — always relevant for a local business
    add({
      prio: 2, cat: 'Local SEO', icon: '🏪', impact: 'high', effort: 'low', timeToImpact: '2–4 weeks',
      title: 'Work your Google Business Profile weekly',
      why: 'GBP is a living ranking signal, not a set-and-forget listing. Weekly Google Posts, fully populated Products/Services, fresh photos, prompt messaging and answered Q&A all feed the local algorithm.',
      action: 'Post a Google Update weekly, fill Products/Services with keyword-rich course descriptions, upload 3–5 photos/month, enable messaging, and seed the Q&A.',
    });

    // Reviews — strongest lever for both local pack and AI citations
    add({
      prio: 1, cat: 'Reviews', icon: '⭐', impact: 'high', effort: 'low', timeToImpact: '4–8 weeks',
      title: 'Run a Google review acquisition system',
      why: 'Review quantity, recency and response-rate are active local ranking signals — review velocity matters as much as total count. Reviews also lift AI-answer citation rate dramatically (≈1% with none → ≈53% with even a handful).',
      action: 'Ask every student for a Google review at course completion (QR code + short link), aim for 4–8/month, and reply to all reviews within 24h.',
    });

    // ════════════════ MEASUREMENT ════════════════
    if (!gscConnected || avgPos == null) {
      add({
        prio: 1, cat: 'Measurement', icon: '🔌', impact: 'high', effort: 'med', timeToImpact: '2–3 days',
        title: 'Confirm Google Search Console data is flowing',
        why: "The dashboard still shows 0 tracked keywords. If you just connected GSC, data takes 2–3 days to populate; if it stays empty, the service-account credential or sitemap submission needs fixing. Without it the engine can't find striking-distance keywords or measure progress.",
        action: 'Verify the property, ensure the service-account credential is set, submit the sitemap, then re-check in 2–3 days.',
      });
    }

    // ════════════════ AI / ANSWER-ENGINE VISIBILITY ════════════════
    if (aeoChecked > 0 && aeoCited === 0) {
      add({
        prio: 1, cat: 'AI / AEO', icon: '🤖', impact: 'high', effort: 'med', timeToImpact: '1–3 months',
        title: `Cited in 0 of ${aeoChecked} AI answer checks — fix it`,
        why: 'AI answer engines decide which brands to surface. Review profiles are the strongest lever; answer-first, intro-loaded content matters too — 44% of AI citations come from the first 30% of a page.',
        action: 'Build the review profile (above), add author/Org credentials (E-E-A-T), and lead each key page with a direct 1–2 sentence answer before the detail.',
      });
    }

    // ════════════════ INDEXATION ════════════════
    if (submitted === 0 && pages > 0) {
      add({
        prio: 2, cat: 'Indexation', icon: '🗂️', impact: 'med', effort: 'low', timeToImpact: '1–2 weeks',
        title: `Push your ${pages} pages for indexing`,
        why: 'Nothing submitted to Google/Bing yet. Faster indexing means new and updated pages start ranking sooner.',
        action: 'Enable IndexNow + sitemap submission so every crawl auto-pings Google & Bing.',
      });
    }

    // ════════════════ KEYWORDS (activate once GSC data flows) ════════════════
    if (opps.length > 0) {
      add({
        prio: 1, cat: 'Content', icon: '🎯', impact: 'high', effort: 'med', timeToImpact: '2–6 weeks',
        title: `${opps.length} striking-distance keywords (position 11–20)`,
        why: 'These already rank on page 2 — small on-page improvements often push them onto page 1, where the clicks are. Highest-ROI content work available.',
        action: "Strengthen each target page's title, intro answer, headings and internal links.",
      });
    }
    if (lowCtr.length > 0) {
      add({
        prio: 2, cat: 'Content', icon: '✏️', impact: 'high', effort: 'low', timeToImpact: '2–4 weeks',
        title: `${lowCtr.length} page-1 keywords with low CTR — rewrite titles`,
        why: 'These rank in the top 10 but get few clicks. A compelling, benefit-led title tag + meta description recovers clicks with zero new content.',
        action: 'Rewrite the title/meta for each: lead with the benefit, add the year/location, and match search intent.',
      });
    }
    if (page1NotTop3.length > 0) {
      add({
        prio: 2, cat: 'Content', icon: '🔝', impact: 'med', effort: 'med', timeToImpact: '3–8 weeks',
        title: `${page1NotTop3.length} keywords on page 1 but outside the top 3`,
        why: 'Click-through drops steeply below position 3. Pushing these up captures the bulk of the available traffic.',
        action: 'Add depth, internal links from high-authority pages, and updated/fresh content to each target page.',
      });
    }

    // ════════════════ TECHNICAL ════════════════
    if (critical > 0) {
      add({
        prio: 1, cat: 'Technical', icon: '🛠️', impact: 'high', effort: 'med', timeToImpact: 'days',
        title: `Resolve ${critical} critical technical issue${critical > 1 ? 's' : ''}`,
        why: 'Critical issues (indexability, broken meta, schema errors) directly block ranking. Clear these before investing in content.',
        action: 'The auto-fixer handles most; the rest are flagged for manual action.',
      });
    }
    if (broken > 0) {
      add({
        prio: 2, cat: 'Technical', icon: '🔗', impact: 'med', effort: 'low', timeToImpact: '1 week',
        title: `Fix ${broken} broken link${broken > 1 ? 's' : ''}`,
        why: 'Broken links waste crawl budget, leak link equity and hurt user trust — a quick win.',
        action: 'Update or redirect each broken URL.',
      });
    }

    // Structured-data errors found by the StructuredDataAuditor (GSC "invalid items" class)
    if (schemaAudit && schemaAudit.totalIssues > 0) {
      const dupFaq = schemaAudit.duplicateFaqPages || 0;
      const detail = dupFaq > 0
        ? `${dupFaq} page(s) ship a duplicate FAQPage (a static block + a per-route block) — exactly what Google reports as "FAQ: invalid items".`
        : `${schemaAudit.totalIssues} structured-data issue(s) across ${schemaAudit.pagesWithIssues} page(s) (empty answers, disallowed HTML, missing fields).`;
      add({
        prio: 1, cat: 'Schema', icon: '🧩', impact: 'high', effort: 'low', timeToImpact: '1–2 weeks',
        title: `Fix ${schemaAudit.totalIssues} structured-data error${schemaAudit.totalIssues > 1 ? 's' : ''} flagged by the schema auditor`,
        why: `${detail} Invalid structured data loses rich-result eligibility (stars, FAQ) — a direct CTR hit.`,
        action: 'Ensure exactly one block per @type per page; give every FAQ item a question + non-empty answer; remove disallowed HTML from answers. See schema-audit.json for the exact pages.',
      });
    }

    // Schema expansion — tuned for an academy/course business
    add({
      prio: 2, cat: 'Schema', icon: '🏷️', impact: 'high', effort: 'med', timeToImpact: '2–4 weeks',
      title: 'Expand structured data (Course, LocalBusiness, Breadcrumb, Review)',
      why: `You already ship FAQ + Organization schema. For ${this.business === 'academy' ? 'an academy' : 'this business'}, Course schema makes courses eligible for rich results, AggregateRating shows ⭐ stars in the SERP (big CTR lift), and LocalBusiness + BreadcrumbList strengthen local + navigation signals.`,
      action: 'Add Course schema to each course page, AggregateRating from your Google reviews, LocalBusiness on contact/home, and BreadcrumbList sitewide.',
    });

    // ════════════════ PERFORMANCE ════════════════
    add({
      prio: 2, cat: 'Performance', icon: '⚡', impact: 'med', effort: 'med', timeToImpact: '2–6 weeks',
      title: 'Track & fix Core Web Vitals (LCP / INP / CLS)',
      why: 'INP is the most-failed Core Web Vital in 2026 — 43% of sites miss the 200ms target. Targets: LCP < 2.5s, INP < 200ms, CLS < 0.1. Passing all three cuts bounce ~24%.',
      action: 'Wire the PageSpeed/CrUX solver into the daily run. Quick wins: explicit width/height on images, defer non-critical JS, preload the hero image.',
    });

    // ════════════════ TRUST / E-E-A-T ════════════════
    add({
      prio: 2, cat: 'Trust', icon: '🎓', impact: 'med', effort: 'med', timeToImpact: 'ongoing',
      title: 'Strengthen E-E-A-T signals',
      why: 'Trust is now the primary filter for AI inclusion and a growing ranking factor. Real author identities, credentials, and social proof tell Google and LLMs you are a credible source.',
      action: 'Add author bios with credentials to every post, a detailed About page (founder, faculty, accreditations), student testimonials, and link real social profiles.',
    });

    // ════════════════ CONTENT / TOPICAL AUTHORITY ════════════════
    const briefCount = (report.contentBriefs || []).length;
    add({
      prio: 3, cat: 'Content', icon: '✍️', impact: 'med', effort: 'high', timeToImpact: '2–4 months',
      title: briefCount > 0 ? `Execute your ${briefCount} content briefs into topic clusters` : 'Build topical authority with content clusters',
      why: 'Depth and topical coverage win both classic rankings and AI citations. A pillar page + supporting cluster, richly interlinked, signals expertise (the first "E" in E-E-A-T).',
      action: 'Group target keywords into 3–5 clusters (e.g. "digital marketing course", "SEO training", "PPC course"); publish one pillar + 4–6 supporting posts each, all interlinked.',
    });
    add({
      prio: 3, cat: 'Content', icon: '🔄', impact: 'med', effort: 'low', timeToImpact: '1–2 months',
      title: 'Refresh existing content on a schedule',
      why: 'Freshness is a ranking signal and re-engages AI crawlers. Updating proven pages is far cheaper than writing new ones and often recovers slipping rankings.',
      action: 'Each month, update your 5 highest-impression pages: new stats/year, expanded answers, refreshed examples, and an updated "last modified" date.',
    });
    add({
      prio: 3, cat: 'Content', icon: '💬', impact: 'med', effort: 'med', timeToImpact: '1–3 months',
      title: 'Target featured snippets & "People Also Ask"',
      why: 'Snippet/PAA answers win position-zero visibility and are the exact format AI answer engines lift. Structured Q&A content is dual-purpose for SEO and AEO.',
      action: 'For each target query add a concise 40–55 word direct answer under a question heading, plus a short list/table where it fits.',
    });

    // ════════════════ MAINTAIN AEO STRENGTH (a "done well" item) ════════════════
    if (aeoScore != null && aeoScore >= 90) {
      add({
        prio: 3, cat: 'AI / AEO', icon: '✅', impact: 'med', effort: 'low', timeToImpact: 'ongoing', done: true,
        title: `AEO foundation is strong (score ${aeoScore}/100)`,
        why: 'llms.txt is live, AI crawlers are allowed, and pages carry FAQ + Organization schema. Keep it fresh as content changes.',
        action: 'Maintain: regenerate llms.txt on the weekly cron and keep FAQPage schema on new pages.',
      });
    }

    // order: priority asc, then highest impact×effort score first, done last
    recs.sort((a, b) => (a.prio - b.prio) || ((a.done ? 1 : 0) - (b.done ? 1 : 0)) || (b.score - a.score));

    // ════════════════ HEALTH SCORE (weighted pillars, sums to 100) ════════════════
    const pillars = [
      { key: 'Technical', weight: 20, val: critical === 0 && broken === 0 ? 20 : Math.max(0, 20 - critical * 5 - broken * 2) },
      { key: 'AI / AEO', weight: 20, val: aeoScore != null ? Math.round((aeoScore / 100) * 20) : 0 },
      { key: 'AI citations', weight: 10, val: aeoChecked === 0 ? 0 : Math.round((aeoCited / aeoChecked) * 10) },
      { key: 'Local SEO', weight: 20, val: totalCites > 0 ? Math.round(Math.min(tier1Live / 5, 1) * 14 + Math.min(liveCites / totalCites, 1) * 6) : 0 },
      { key: 'Keywords', weight: 15, val: kwTotal === 0 ? 0 : Math.round(8 + (avgPos != null ? Math.max(0, (30 - Math.min(avgPos, 30)) / 30) * 7 : 0)) },
      { key: 'Indexation', weight: 15, val: submitted > 0 ? 15 : pages > 0 ? 6 : 0 },
    ];
    let healthScore = pillars.reduce((t, p) => t + p.val, 0);
    healthScore = Math.max(0, Math.min(100, Math.round(healthScore)));
    const grade = healthScore >= 90 ? 'Excellent' : healthScore >= 75 ? 'Good' : healthScore >= 55 ? 'Fair' : healthScore >= 35 ? 'Needs work' : 'Critical';

    // ════════════════ MOMENTUM / TREND (from history.json, newest-first) ════════════════
    const momentum = this._momentum(history);

    const openP1 = recs.filter((r) => r.prio === 1 && !r.done).length;
    const open = recs.filter((r) => !r.done).length;
    let summary = openP1 > 0
      ? `${openP1} high-priority move${openP1 > 1 ? 's' : ''} to make now, ${open} total — ranked by impact on your rankings.`
      : `${open} optimization${open > 1 ? 's' : ''} queued — no critical blockers right now.`;
    if (momentum && momentum.note) summary += ' ' + momentum.note;

    return {
      timestamp: new Date().toISOString(),
      engine: 'StrategyEngine v2',
      siteUrl: this.siteUrl,
      healthScore,
      grade,
      pillars,
      momentum,
      summary,
      recommendations: recs,
    };
  }

  _momentum(history) {
    const hist = Array.isArray(history) ? history : [];
    if (hist.length < 2) return null;
    const today = hist[0];
    const prior = hist[Math.min(hist.length - 1, 6)]; // ~a week ago (or oldest)
    const kwDelta = (today.totalKeywords || 0) - (prior.totalKeywords || 0);
    const critDelta = (today.critical || 0) - (prior.critical || 0);
    let posDelta = null; // positive = improved (lower position number)
    if (today.avgPosition != null && prior.avgPosition != null) {
      posDelta = +(prior.avgPosition - today.avgPosition).toFixed(1);
    }
    const bits = [];
    if (posDelta != null && posDelta !== 0) bits.push(posDelta > 0 ? `avg position up ${posDelta}` : `avg position down ${Math.abs(posDelta)}`);
    if (kwDelta > 0) bits.push(`+${kwDelta} keywords tracked`);
    if (critDelta < 0) bits.push(`${Math.abs(critDelta)} fewer critical issues`);
    const direction = (posDelta || 0) > 0 || kwDelta > 0 || critDelta < 0 ? 'improving'
      : (posDelta || 0) < 0 || critDelta > 0 ? 'declining' : 'steady';
    const note = bits.length ? `Last 7 days: ${bits.join(', ')}.` : '';
    return { window: '7d', direction, keywordsDelta: kwDelta, criticalDelta: critDelta, positionDelta: posDelta, note };
  }
}

module.exports = { StrategyEngine };
