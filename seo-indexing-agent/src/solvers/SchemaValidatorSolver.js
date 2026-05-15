'use strict';

const https = require('https');
const cheerio = require('cheerio');
const axios = require('axios');

/**
 * SchemaValidatorSolver — extracts JSON-LD blocks from a page and
 * validates them against schema.org structure. Identifies missing
 * required fields that cost rich-snippet eligibility (which lifts CTR
 * significantly — often a faster win than ranking improvements).
 */
class SchemaValidatorSolver {
  constructor(config = {}) {
    this.config = config;
    this.name = 'Schema Validator';
  }

  score(issue) {
    const t = (issue.type || '').toUpperCase();
    const title = (issue.title || '').toLowerCase();
    if (t.includes('SCHEMA'))            return 100;
    if (t.includes('STRUCTURED'))        return 100;
    if (title.includes('rich snippet'))  return 90;
    if (title.includes('json-ld'))       return 95;
    return 0;
  }

  async attempt(issue, ctx) {
    const url = ctx.siteUrl || issue.url;
    if (!url) return { solved: false };

    try {
      const { data: html } = await axios.get(url, { timeout: 15000 });
      const $ = cheerio.load(html);
      const blocks = [];
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          const parsed = JSON.parse($(el).html());
          blocks.push(parsed);
        } catch (e) {
          blocks.push({ __parseError: e.message, raw: $(el).html()?.slice(0, 200) });
        }
      });

      const issues = [];
      for (const block of blocks) {
        if (block.__parseError) {
          issues.push({ severity: 'critical', message: `Invalid JSON-LD: ${block.__parseError}` });
          continue;
        }
        issues.push(...this._validateBlock(block));
      }

      const diagnosis = {
        blocksFound:    blocks.length,
        invalidBlocks:  blocks.filter(b => b.__parseError).length,
        validationIssues: issues,
        summary: `${blocks.length} JSON-LD block(s), ${issues.length} validation issue(s)`,
      };

      return { solved: false, diagnosis, enrichment: { schema: diagnosis } };
    } catch (err) {
      return { solved: false, error: err.message };
    }
  }

  _validateBlock(block) {
    const issues = [];
    const type = block['@type'];
    if (!type) {
      issues.push({ severity: 'critical', message: 'Schema block missing @type' });
      return issues;
    }

    // Required fields by common @type
    const required = {
      'EducationalOrganization': ['name', 'url'],
      'Course':                  ['name', 'description', 'provider'],
      'LocalBusiness':           ['name', 'address', 'telephone'],
      'Organization':            ['name', 'url'],
      'FAQPage':                 ['mainEntity'],
      'BreadcrumbList':          ['itemListElement'],
      'Product':                 ['name', 'description', 'offers'],
    };
    for (const f of (required[type] || [])) {
      if (!block[f]) {
        issues.push({ severity: 'important', message: `${type} missing required field: ${f}` });
      }
    }
    return issues;
  }
}

module.exports = { SchemaValidatorSolver };
