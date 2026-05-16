'use strict';

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

/**
 * LLMsTxtBuilder — generates llms.txt and llms-full.txt at the site root.
 *
 * llms.txt is the proposed standard (llmstxt.org) for telling LLMs what a
 * site is about in a single, markdown-friendly file. ChatGPT, Claude, and
 * Perplexity all check for it. Format:
 *
 *   # Site Title
 *   > One-line summary
 *   ## Section
 *   - [Page Title](URL): Description
 *
 * llms-full.txt is the full markdown content dump — used when an LLM wants
 * the actual page text without scraping individual URLs.
 */
class LLMsTxtBuilder {
  constructor(config = {}) {
    this.config = config;
    this.publicDir = config.publicDir || '../public';
    this.siteUrl = config.siteUrl;
  }

  async build(pages) {
    const compact = this._buildCompact(pages);
    const full    = this._buildFull(pages);

    fs.mkdirSync(this.publicDir, { recursive: true });
    fs.writeFileSync(path.join(this.publicDir, 'llms.txt'), compact);
    fs.writeFileSync(path.join(this.publicDir, 'llms-full.txt'), full);

    return { compact, full };
  }

  _buildCompact(pages) {
    const indexable = pages.filter(p => p.statusCode === 200 && p.isIndexable);
    const homepage = indexable.find(p => new URL(p.url).pathname === '/');

    let out = `# Telzon Academy — Digital Marketing Training Institute, Nagpur\n\n`;
    out += `> ${(homepage?.metaDescription || 'Nagpur\'s leading digital marketing institute offering practical training in SEO, Google Ads, social media, content marketing and analytics with 95% placement assistance.').trim()}\n\n`;

    // Group by URL pattern
    const groups = {
      'Core pages':    [],
      'Course pages':  [],
      'Blog articles': [],
      'Other':         [],
    };

    for (const p of indexable) {
      const pathname = new URL(p.url).pathname;
      const title = p.title || pathname;
      const desc  = (p.metaDescription || '').slice(0, 160);
      const line  = `- [${title}](${pathname}): ${desc}`;

      if (pathname === '/' || pathname === '/blog' || pathname === '/lead-generation-package' || pathname === '/free-demo') {
        groups['Core pages'].push(line);
      } else if (pathname.startsWith('/pages/')) {
        groups['Course pages'].push(line);
      } else if (pathname.startsWith('/blog/')) {
        groups['Blog articles'].push(line);
      } else if (!pathname.startsWith('/admin')) {
        groups['Other'].push(line);
      }
    }

    for (const [section, lines] of Object.entries(groups)) {
      if (lines.length === 0) continue;
      out += `## ${section}\n\n${lines.join('\n')}\n\n`;
    }

    out += `## About\n\n`;
    out += `Telzon Academy is based in Nagpur, Maharashtra, India. Contact: +91-9307189776 · connect@telzonacademy.in\n\n`;
    out += `## Last updated\n\n${new Date().toISOString().split('T')[0]}\n`;

    return out;
  }

  _buildFull(pages) {
    const indexable = pages.filter(p => p.statusCode === 200 && p.isIndexable);
    let out = `# Telzon Academy — Full Content Digest\n\n`;
    out += `Generated ${new Date().toISOString()} · ${indexable.length} pages\n\n---\n\n`;

    for (const p of indexable) {
      const pathname = new URL(p.url).pathname;
      out += `## [${p.title || pathname}](${p.url})\n\n`;
      if (p.metaDescription) out += `${p.metaDescription}\n\n`;
      if (p.h1) out += `### ${p.h1}\n\n`;
      // Strip HTML to plain text for body
      if (p.html) {
        const $ = cheerio.load(p.html);
        $('script, style, nav, footer, header').remove();
        const text = $('body').text().replace(/\s+/g, ' ').trim();
        if (text && text.length > 100) {
          out += text.slice(0, 1500) + (text.length > 1500 ? '...' : '') + '\n\n';
        }
      }
      out += `---\n\n`;
    }

    return out;
  }
}

module.exports = { LLMsTxtBuilder };
