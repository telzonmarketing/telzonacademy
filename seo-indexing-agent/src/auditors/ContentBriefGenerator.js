'use strict';

/**
 * ContentBriefGenerator — for each "almost page 1" keyword (position 11-20)
 * with meaningful impressions, produce an actionable optimization brief:
 *   - which page is ranking
 *   - the gap to page 1
 *   - concrete on-page actions (title, H1, internal links, content depth)
 *
 * These briefs are the highest-leverage SEO actions because a small push
 * on a position-15 keyword often unlocks 10x organic traffic.
 */
class ContentBriefGenerator {
  constructor(config = {}) {
    this.config = config;
  }

  generate(keywords = []) {
    if (!keywords.length) return { briefs: [], total: 0 };

    // Opportunity zone: position 11-20, with >= 20 impressions (real demand)
    const opportunities = keywords.filter(k =>
      k.position >= 11 && k.position <= 20 && (k.impressions || 0) >= 20
    );

    const briefs = opportunities.map(k => this._briefFor(k)).sort(
      (a, b) => b.priority - a.priority
    );

    return {
      briefs: briefs.slice(0, 20),
      total: briefs.length,
      generatedAt: new Date().toISOString(),
    };
  }

  _briefFor(kw) {
    const positionsToGain = Math.max(1, Math.ceil(kw.position - 10));
    const priority = (kw.impressions || 0) * (1 / Math.max(kw.position, 1));
    const actions = this._suggestActions(kw);

    return {
      query: kw.query,
      page: kw.page,
      currentPosition: kw.position,
      currentImpressions: kw.impressions,
      currentClicks: kw.clicks,
      currentCtr: kw.ctr,
      positionsToGain,
      estimatedTrafficGain: Math.round((kw.impressions || 0) * 0.18),  // CTR ~18% at pos 5
      priority: Math.round(priority * 10) / 10,
      actions,
    };
  }

  _suggestActions(kw) {
    const actions = [];
    const q = kw.query.toLowerCase();

    // 1) Title tag tuning — front-load primary keyword
    actions.push({
      type: 'title',
      label: 'Title tag: lead with the exact query',
      detail: `Set <title>${kw.query} | Telzon Academy</title> — front-loading "${kw.query}" tells Google the page is specifically about this term.`,
    });

    // 2) H1 alignment
    actions.push({
      type: 'h1',
      label: 'H1 must contain the exact query',
      detail: `The first <h1> should include "${kw.query}" verbatim. Variations like related terms can live in H2s.`,
    });

    // 3) Content depth — based on query type
    if (q.includes('course') || q.includes('training') || q.includes('class')) {
      actions.push({
        type: 'content',
        label: 'Add a "What you\'ll learn" module',
        detail: 'Pages ranking for course-related queries that beat ours have: curriculum modules, duration, fee, placement %, instructor bio, certifications, FAQs.',
      });
    } else if (q.includes('near me') || q.includes('in nagpur') || q.includes('in ')) {
      actions.push({
        type: 'content',
        label: 'Add local-intent signals',
        detail: 'For "near me / in [city]" queries: include address with map embed, opening hours, local phone, NAP consistency, Google Business Profile link.',
      });
    } else if (q.includes('best') || q.includes('top') || q.includes('vs')) {
      actions.push({
        type: 'content',
        label: 'Add comparison / list structure',
        detail: 'Comparison queries need: numbered list, comparison table, pros/cons, decision criteria. Wrap in <table> or <ol> for rich-result eligibility.',
      });
    } else {
      actions.push({
        type: 'content',
        label: 'Increase content depth',
        detail: 'Target 1,500-2,000 words. Cover: definition, why it matters, how it works, examples, FAQs, related queries. Match top-ranking pages\' depth.',
      });
    }

    // 4) Internal linking — bring authority to this page
    actions.push({
      type: 'internal-link',
      label: 'Add 3-5 internal links pointing TO this page',
      detail: `Find related pages on telzonacademy.in and add anchor text "${kw.query}" linking to ${kw.page}. Internal PageRank flow is the fastest way to lift a position-${kw.position} keyword.`,
    });

    // 5) Schema markup
    if (q.includes('course')) {
      actions.push({
        type: 'schema',
        label: 'Add Course schema',
        detail: 'Wrap the page in schema.org/Course with: name, description, provider, hasCourseInstance (duration, fee, mode). Rich snippets dramatically lift CTR.',
      });
    } else if (q.match(/(faq|how|what|why)/)) {
      actions.push({
        type: 'schema',
        label: 'Add FAQPage schema',
        detail: 'Question-style queries match FAQPage schema. Add a JSON-LD block with at least 4 Q&A pairs answering the query and its variants.',
      });
    }

    // 6) CTR improvement if visible enough
    if ((kw.impressions || 0) > 100 && (kw.ctr || 0) < 3) {
      actions.push({
        type: 'meta-desc',
        label: 'Rewrite meta description for click-through',
        detail: `Current CTR is ${kw.ctr}% — below average. Rewrite the meta description as a benefit-led sentence containing "${kw.query}" plus a hook ("Free demo", "95% placement", "Limited seats").`,
      });
    }

    return actions;
  }
}

module.exports = { ContentBriefGenerator };
