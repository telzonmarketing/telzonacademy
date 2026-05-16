'use strict';

const cheerio = require('cheerio');

/**
 * FAQSchemaGenerator — turns existing page content into FAQPage JSON-LD.
 *
 * AI engines (ChatGPT, Perplexity, Google AI Overviews) cite FAQPage-tagged
 * content 3-5× more often than plain prose. This generator scans each page
 * for question-style headings and their immediately following paragraphs,
 * then emits a ready-to-paste JSON-LD block.
 *
 * Output is *suggestions* — not auto-applied — because the page component
 * needs to render the script tag, which requires React/Helmet integration.
 */
class FAQSchemaGenerator {
  constructor(config = {}) {
    this.config = config;
  }

  generate(pages) {
    const suggestions = [];

    for (const page of pages) {
      if (page.statusCode !== 200 || !page.html) continue;
      const $ = cheerio.load(page.html);
      const faqs = [];

      // Existing FAQ schema — skip
      if (/"@type"\s*:\s*"FAQPage"/i.test(page.html)) continue;

      // Strategy 1: H2/H3 ending with "?" followed by P/DIV
      $('h2, h3').each((_, el) => {
        const q = $(el).text().trim();
        if (!q.endsWith('?') && !/^(what|how|why|when|where|who|can|do|is|are)\b/i.test(q)) return;

        const a = $(el).nextUntil('h1, h2, h3').first().text().trim();
        if (a && a.length > 20 && a.length < 800) {
          faqs.push({ q, a: a.replace(/\s+/g, ' ') });
        }
      });

      // Strategy 2: "FAQ" / "Frequently asked" labelled sections with DT/DD or P pairs
      const faqSection = $(':contains("Frequently Asked"), :contains("FAQ")').first();
      if (faqSection.length && faqs.length === 0) {
        faqSection.find('dt').each((i, el) => {
          const q = $(el).text().trim();
          const a = $(el).next('dd').text().trim();
          if (q && a) faqs.push({ q, a: a.replace(/\s+/g, ' ') });
        });
      }

      if (faqs.length >= 3) {
        const schema = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.slice(0, 10).map(f => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.a,
            },
          })),
        };
        suggestions.push({
          url: page.url,
          path: new URL(page.url).pathname,
          faqCount: faqs.length,
          previewQuestions: faqs.slice(0, 3).map(f => f.q),
          jsonLd: schema,
          inject: `<script type="application/ld+json">${JSON.stringify(schema)}</script>`,
        });
      }
    }

    return suggestions.sort((a, b) => b.faqCount - a.faqCount);
  }
}

module.exports = { FAQSchemaGenerator };
