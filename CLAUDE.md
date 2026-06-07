# Telzon Academy — Project Instructions

Standing instructions for any session working on this codebase. Read fully before making changes.

## Project basics

- Path: `/Users/rohit/Downloads/telzonacademy/`
- Stack: Vite 4.5 + React 18 + Tailwind 3.4 + react-router + react-helmet + Supabase + Framer Motion + Locomotive Scroll
- Live: `https://telzonacademy.in` (Hostinger shared hosting)
- Repo: `https://github.com/telzonmarketing/telzonacademy` (org `telzonmarketing`)
- Branch: `main` (auto-deploys to Hostinger via its own GitHub integration ~52s after push; the `.github/workflows/deploy.yml` SCP route also exists but currently times out — Hostinger's own pull is what actually ships)
- Build: `npm run build` runs `vite build && node tools/prerender.js`
- Prerender: `tools/prerender.js` emits 63 unique static HTML files under `dist/` (1 homepage + `/blog` + `/lead-generation-package` + 61 landing pages under `/pages/<slug>/`). Each gets unique title/description/canonical/OG and 200+ words of static fallback wrapped in `<noscript>` so JS users don't see FOUC but crawlers without JS still parse it.
- Landing page config lives in `src/pages/landingPagesConfig.js`; per-slug FAQs in `src/pages/landingPagesFaqs.js` (shared between React and prerender so both stay in sync).
- Supabase tables touched by the app: `seoSettings`, `blogs`, `hiring_companies`. Don't modify schema without an explicit ask.

## Design tokens

- Tailwind variables in `src/index.css` and `tailwind.config.js`
- Indigo `#4760eb` + violet `#8b5cf6` accents on `#08080a` background, success green `#19c37d`
- Fonts: Inter (sans) + Instrument Serif italic (display)
- Reusable utility classes: `.surface-card`, `.surface-card-elevated`, `.surface-card-popular`, `.badge-tag`, `.badge-tag-accent`, `.btn-primary`, `.btn-secondary`, `.btn-accent`, `.input-field`, `.grid-bg`, `.font-serif-display`
- Logo assets in `public/`: `telzon-logo-white-1024.png` (wordmark), `telzon-mark-white-{96,128,256}.png` (mark only), `favicon-{16,32,48,96,144,192}.png`, `favicon.ico` (5 sizes embedded)

## Standard guardrails (always apply)

- Do NOT change functionality, backend logic, routes, forms, auth, Supabase calls, or business logic when doing UI/SEO work.
- Do NOT add new dependencies without flagging it first.
- Do NOT skip pre-commit hooks (`--no-verify`) or bypass signing.
- Verify in browser preview before declaring UI work done.
- Touching `.htaccess`, `manifest.webmanifest`, or anything in `public/seo-reports/` or `public/clients/` may collide with the SEO bot that auto-commits — check `git log` first.

---

## Advanced SEO Expansion Strategy (standing authority)

The remainder of this file is standing authority for SEO expansion work on this project. Apply it without re-asking.

### Keyword Expansion Permission

You are allowed to identify keyword gaps and search opportunities. If additional keywords can bring relevant organic traffic, you may target them.

However, do NOT:

- Cannibalize existing pages
- Duplicate existing content
- Replace ranking pages
- Modify successful content unnecessarily
- Create thin pages
- Create AI-generated spam content
- Stuff keywords unnaturally

Every new page must have a clear purpose and unique search intent.

### New Landing Pages (when required)

If keyword research shows opportunities not currently covered, you may recommend and prepare additional pages. Examples by cluster:

**Digital Marketing**
- Digital Marketing Course in Nagpur
- Advanced Digital Marketing Course in Nagpur
- Online Digital Marketing Course
- Weekend Digital Marketing Classes
- Digital Marketing Certification Course

**SEO**
- SEO Course in Nagpur
- Advanced SEO Training in Nagpur
- SEO Certification Course
- Local SEO Training

**Google Ads**
- Google Ads Course in Nagpur
- PPC Training in Nagpur
- Performance Marketing Course

**Social Media**
- Social Media Marketing Course
- Instagram Marketing Course
- Facebook Ads Course

**AI Marketing**
- AI Marketing Course in Nagpur
- AI Tools for Digital Marketers
- Generative AI for Marketing

**Career-Focused**
- Digital Marketing Jobs in Nagpur
- Digital Marketing Salary in India
- Career After Digital Marketing Course
- Digital Marketing Interview Preparation

### Content Quality Requirements

Every new page must:

**Be completely unique**

- 1,200–2,500 words
- Human-readable
- Expert-level quality
- No duplicate paragraphs
- No spun content

**Include**

- Unique introduction
- Course overview
- Benefits
- Curriculum highlights
- Career opportunities
- FAQ section
- Student outcomes
- Local relevance
- Internal links
- Schema markup opportunities

### Search Intent Mapping

Before creating a page, determine:

- Informational intent
- Commercial intent
- Transactional intent
- Local intent

Only create pages where intent is clearly different from existing pages.

### Keyword Research Process

Use existing keyword data, search trends, competitor analysis, People Also Ask questions, and related searches to identify opportunities.

Prioritize:

**High-intent keywords** — Best Digital Marketing Course in Nagpur · Digital Marketing Institute in Nagpur · SEO Training in Nagpur

**Long-tail keywords** — Best digital marketing course with placement in Nagpur · SEO course for beginners in Nagpur · AI marketing course in Nagpur

**AI search queries** — Optimize for questions people ask ChatGPT, Gemini, Claude, and Perplexity. Examples: Which is the best digital marketing institute in Nagpur? · Is digital marketing a good career in 2026? · What skills are taught in a digital marketing course? · How long does it take to learn SEO?

### Topical Authority Strategy

Build strong topical clusters around:

**Digital Marketing** (parent topic) with supporting topics: SEO, Google Ads, Social Media Marketing, Content Marketing, Email Marketing, Analytics, AI Marketing, Automation.

Create semantic relationships between all topics.

### GEO (Generative Engine Optimization)

Every new page should be optimized for AI citations. Include:

- **Direct answer sections** — answer questions in 40–80 words
- **Quick facts sections** — provide structured facts
- **FAQ blocks** — clear answers
- **Entity references** — mention related entities naturally
- **Knowledge panels** — concise educational information

### Before any new page is created

Provide a report containing:

- Target keyword
- Search intent
- Why the page is needed
- Potential traffic opportunity
- Risk of cannibalization (cross-check against `src/pages/landingPagesConfig.js`)
- Proposed URL
- Internal linking strategy

Do not publish the page until approved.

### Final restriction

You may identify keyword opportunities and create draft pages with unique content, but:

- Do NOT deploy
- Do NOT publish
- Do NOT replace existing pages
- Do NOT modify ranking pages without justification
- Do NOT create duplicate content

Provide all recommendations and drafts for review first, then wait for approval before implementation.

---

## Additional Standing Rules

### Existing SEO Assets Protection

Before creating any new page, audit:

- All existing landing pages (`src/pages/landingPagesConfig.js` — 61 slugs)
- All existing blog posts (Supabase `blogs` table, `is_published = true`)
- Sitemap entries (whatever the daily-seo workflow last published)
- `landingPagesConfig.js` slug + headline + metaTitle + metaDescription fields
- Internal linking structure (Footer + LocalAreasSection + RelatedPagesSection in `src/pages/LandingPage.jsx`)

Do not create a new page if an existing page already satisfies the same search intent.

### Cannibalization Prevention

For every proposed page provide:

- Target keyword
- Secondary keywords
- Search intent
- Existing competing page (if any) — name the exact slug from `landingPagesConfig.js`
- Why the current page cannot rank for the new target
- Why a new page is required

No page creation without this analysis.

### AI Search Visibility Priority

When evaluating opportunities, prioritize in this order:

1. High-conversion keywords
2. Local Nagpur keywords
3. Placement-focused keywords
4. AI-related marketing keywords
5. Questions appearing in ChatGPT, Gemini, Perplexity, and Google AI Overviews

Do not chase traffic-only keywords with low business value.

### Content Quality Standard

Every new page must:

- Be factually accurate
- Be written for humans first
- Demonstrate expertise
- Include local relevance (Nagpur areas, neighbourhoods, hiring partners)
- Include unique examples
- Include FAQs (per-page entries added to `src/pages/landingPagesFaqs.js`, not the default array)
- Include structured entities (Course, FAQ, BreadcrumbList JSON-LD at minimum)

Avoid generic AI-written content.

### GEO Requirements

Each page should contain:

- Direct answer section (40–80 words at the top)
- Key takeaways section
- Course facts section (structured: duration · fees · batch options · certifications)
- FAQ section
- Related entities section (mention Telzon Academy, Nagpur, specific tools/platforms by name)

Optimize for citation by AI engines.

### Technical SEO Safety

Before any deployment, verify:

- `sitemap.xml` (regenerated by `generate-sitemap.yml` workflow — confirm new URL is included)
- `robots.txt` (not blocking the new path)
- Canonical tags (prerender.js sets `<link rel="canonical">` per route — confirm the new slug resolves)
- Schema validation (run JSON-LD through Google Rich Results Test or equivalent)
- Internal links (at least 2 inbound links from existing pages)
- No broken links (outbound + inbound)
- No duplicate titles (re-run the `python3` check from prior sessions over `dist/**/index.html`)
- No duplicate meta descriptions (same)

Generate a pre-deployment report containing the above checklist with pass/fail per item.

### Approval Gate

**Allowed without approval:**

- Research
- Audits
- Drafts (kept in a `drafts/` directory I'll create, never wired into routing)
- Reports
- Content preparation

**Not allowed without approval:**

- Publishing pages
- Deploying (no `git push origin main`)
- Updating `sitemap.xml`
- Updating `src/pages/landingPagesConfig.js`
- Updating `src/App.jsx` route definitions
- Updating `tools/prerender.js` to add new routes
- Creating public URLs
- Merging production changes

Must wait for explicit approval (a clear "go ahead" / "publish" / "ship it" from the user). Quiet acknowledgements like "ok" on a different topic do not count.

---

## Enterprise-Level SEO Governance

### Search Console First Rule

Before proposing any new landing page, check Google Search Console for the target keyword:

- Current ranking URL
- Current impressions
- Current clicks
- Current CTR
- Current average position

If an existing page ranks within positions 1–20 for the target keyword, **prefer optimization over page creation** — strengthening that page is almost always higher-ROI than starting a new one. New page is justified only when no existing page can be reshaped to the new intent.

**Reason:** Prevent keyword cannibalization and authority dilution.

**Data access constraint:** I don't currently have a GSC MCP connected. To enforce this rule, give me one of: (a) a connected GSC MCP, (b) a CSV export from Search Console's "Performance" tab filtered to the target keyword, or (c) a copy-paste of the relevant rows. Without data, I'll surface the rule as "blocked — need GSC data" rather than skip it.

### Revenue Impact Priority

Prioritize work in this order:

1. High-conversion course keywords
2. Placement-related keywords
3. Local Nagpur keywords
4. Commercial investigation keywords
5. Informational blog opportunities

Traffic alone is not success. Priority should be leads, inquiries, admissions, and enrollments.

When estimating opportunity in a proposal, lead with projected lead/admission contribution, not raw search volume.

### Competitor Benchmarking Requirement

For every proposed page, document:

- Top 5 ranking competitors for the target keyword (URLs)
- Word count range across those 5
- FAQ count per competitor (and topics covered)
- Schema usage (Course / FAQPage / BreadcrumbList / Review / LocalBusiness)
- Internal linking patterns (how many internal links inbound, anchor texts)
- Unique content angles each competitor takes

Then produce a **content gap analysis** — what every competitor has that we'd be missing, plus our unique angles they don't have.

Do not create pages blindly. The gap analysis is part of the pre-creation report from earlier rule sets — append it there.

### Topical Authority Tracking

Maintain a master topical map covering:

```
Digital Marketing (parent)
├── SEO
├── Google Ads
├── Social Media Marketing
├── AI Marketing
├── Content Marketing
├── Analytics
├── Email Marketing
└── Automation
```

The map lives at `docs/topical-map.md` (I'll create it on first need). Every entry records: pillar URL, supporting URLs, target keywords, internal link weight in/out.

**Every new page must strengthen a cluster.** Avoid isolated pages — if a draft doesn't fit cleanly into the map, reconsider whether it should exist at all.

When adding a page to a cluster, also propose the 2–4 internal links to add from existing cluster pages so the new page inherits authority.

### Deployment Validation Checklist

Before any approved deployment, every item below must pass. This supersedes the "Technical SEO Safety" checklist in the prior ruleset (it's stricter):

- [ ] No duplicate H1 tags (across the new page and across the site for the same keyword)
- [ ] No duplicate `<title>` tags (cross-check via the `python3` uniqueness script we use post-build)
- [ ] No duplicate meta descriptions (same script)
- [ ] Schema validation passes (run JSON-LD through Google Rich Results Test or `schema-dts` validator)
- [ ] Canonical URLs correct (prerender.js writes one — confirm the new slug shows up in `dist/pages/<slug>/index.html` with the right `https://telzonacademy.in/...`)
- [ ] Sitemap generated successfully (the `generate-sitemap.yml` workflow output includes the new URL)
- [ ] Prerender output generated successfully (`dist/pages/<slug>/index.html` exists and has unique title + description + 200+ words of static fallback wrapped in `<noscript>`)
- [ ] Mobile rendering verified in preview (preview server, mobile viewport, screenshot)
- [ ] Core Web Vitals unaffected (no regression in bundle size beyond ~2%; no new render-blocking scripts; no new layout shift)

Deployment is **blocked** until every checkbox passes. Produce a written report listing each item with pass/fail and supporting evidence (file path, screenshot, command output).

### Content Ownership Rule

Draft content may be created freely (kept in `drafts/`, never wired into routing or referenced from `landingPagesConfig.js`).

Production publication requires **all** of:

- Explicit approval received (see Approval Gate)
- Final content review completed
- Cannibalization report completed (Search Console First Rule applied)
- Internal linking plan completed (Topical Authority Tracking applied)
- Technical SEO validation completed (Deployment Validation Checklist applied)
- Competitor benchmarking + content gap analysis completed

No exceptions. If any of the six is missing, publication is blocked and I will surface what's missing rather than ship a partial workflow.

---

## Business Impact & Lead Generation Governance (Tier 4)

### Primary Success Metrics

SEO success is measured in this order:

1. Qualified Leads
2. Course Enquiries
3. Admissions
4. Phone Calls
5. WhatsApp Conversations
6. Form Submissions
7. Organic Traffic
8. Keyword Rankings

**Traffic growth alone is not success.**

Project-specific conversion paths to optimize for, in priority order:

- **Free Demo Class lead form** (`src/components/FreeDemoRegistration.jsx` → `submitLead` in `src/lib/leadSubmit.js` → Supabase + Meta CAPI pixel)
- **WhatsApp click** (every CTA calling `handleCTAClick` / `handleWhatsAppClick` opens `wa.me/919307189776` with prefilled course-enquiry text)
- **Phone call** (every `tel:+919307189776` link in Hero, Footer, contact sections)
- **Location click** (`handleLocationClick` in Header, fires Meta pixel `Schedule` event)
- **Lead generation package strategy call** (`/lead-generation-package` route — separate funnel for B2B lead-gen customers, not students)

When designing any new page, name which of these paths the visitor will be funnelled into and confirm the path is wired in.

### Keyword Value Scoring

Every target keyword is scored on three axes:

**Revenue potential** — High / Medium / Low (based on whether the keyword indicates buying intent for a digital marketing course)
**Search intent** — Transactional / Commercial Investigation / Informational / Navigational
**Priority score** —

```
Priority = Revenue Potential × Intent Strength × Competition Opportunity
```

Where competition opportunity is the inverse of competitor authority — i.e. high score when established sites are weak for the term.

Focus on keywords likely to generate admissions, not visits.

### Page ROI Assessment

Before creating a new page, estimate and document in the pre-creation report:

- Monthly search demand (volume from your keyword data source)
- Conversion potential (% of visitors expected to start a CTA flow)
- Competition level (DR/PA of the top 5 ranking sites)
- Expected lead contribution per month (volume × CTR × conversion-rate × lead-quality factor)
- Expected admission contribution per month (leads × lead-to-admission rate)

If expected admission contribution is below 1/month after 6 months, the page does not justify creation.

### Local Dominance Strategy

Prioritize keywords related to:

- Nagpur (every existing landing page already targets this)
- Maharashtra (state-level pages — none yet)
- Nearby educational hubs (Amravati, Wardha, Bhandara, Chandrapur, Akola — potential expansion area)
- Placement-focused searches
- Career-oriented searches

Goal: become the most authoritative Digital Marketing education entity in the Nagpur region. Every page should reinforce that positioning — mention Nagpur landmarks, local hiring partners, Maharashtra-specific salary data, and area-level keywords (Dharampeth, Sitabuldi, Ramdaspeth, Sadar, etc. — already in 11+ existing slugs, see `landingPagesConfig.js`).

### Conversion Optimization Protection

SEO changes must never reduce:

- Lead generation rate (Free Demo form submissions / day)
- Form completion rate (form starts → form submits)
- WhatsApp clicks (count via Meta pixel custom event)
- Call clicks (tel: links)
- Enquiry submissions (form posts to Supabase)

**If an SEO improvement negatively affects conversions, conversion performance wins.**

Concrete guardrails for me:

- Do not remove or de-emphasize the Free Demo CTA above the fold
- Do not move the WhatsApp / Contact button out of the sticky header
- Do not change `submitLead` call signatures or pixel events
- Do not alter form field copy without A/B-style review
- If a SEO refactor would push a CTA further down the viewport, raise it as a tradeoff before doing it

### AI Citation Tracking

Maintain a list of pages designed for citation by:

- ChatGPT
- Gemini
- Claude
- Perplexity
- Google AI Overviews

The list lives at `docs/ai-citations.md` (I'll create on first need). Each entry records:

- Target question (the exact prompt we're trying to be cited for)
- Answer block on the page (the 40–80 word section optimized for extraction)
- Related entities mentioned (Telzon Academy, Nagpur, named tools/platforms)
- Schema coverage (which JSON-LD types apply — Course / FAQPage / Organization)
- Which AI engine the entry targets (some optimizations diverge across engines)

The existing `public/llms.txt` and `public/llms-full.txt` (maintained by the `seo-aeo-*` workflows) serve the same goal at the file level — keep `docs/ai-citations.md` in sync with what those workflows publish.

### Authority Asset Strategy

Prioritize creation of assets that compound authority over time:

- Ultimate guides (e.g. "Complete Digital Marketing Career Guide for Nagpur Students")
- Industry statistics (curated 2026 stats with citations)
- Salary reports (Nagpur + Maharashtra digital marketing salary by role + experience)
- Career roadmaps (Fresher → Junior → Senior → Specialist progression)
- Tool comparisons (SEMrush vs Ahrefs · GA4 vs Mixpanel · ChatGPT vs Claude for marketing)
- AI marketing resources (prompts, workflows, frameworks)

These compound: they earn backlinks, get cited by AI engines, get linked from other internal pages, and stay relevant for years. Prefer one strong authority asset over five thin pages.

Authority assets are still subject to all approval gates. They live in `drafts/` until shipped.

### Final Decision Framework

When choosing between two paths, apply these tiebreakers in order:

| Choice A | Choice B | Pick |
|----------|----------|------|
| More traffic | More admissions | **Admissions** |
| Higher rankings | Better conversion rate | **Conversion rate** |
| More pages | Stronger existing pages | **Stronger existing pages** (unless research clearly proves expansion is justified — quantified in the Page ROI Assessment above) |

Apply this framework explicitly in every proposal. If a decision can't be reduced to one of these axes, surface the tradeoff and ask before deciding.

---

## Rule precedence

These four rulesets — Advanced SEO Expansion Strategy, Additional Standing Rules, Enterprise-Level SEO Governance, Business Impact & Lead Generation Governance — are cumulative, not replacing. On conflict, the **most restrictive** rule wins; when restrictiveness is ambiguous, the higher-numbered tier wins (Tier 4 beats Tier 1). When in doubt about whether something requires approval, treat it as requiring approval and ask.

---

## SEO Execution Queue (operational workflow)

The four tiers above define **policy** — what to do, what not to do, and what to wait for approval on. This section defines **process** — the 5 phases I run every SEO task through. Each phase has explicit inputs, outputs, and the tier requirements it satisfies.

The live queue lives at `drafts/queue.md` (I'll create on first need). Every opportunity I research gets a row that records which phase it's in, who's blocking it, and when it moved.

### Phase 1 — Data Collection

**Required inputs**

Google Search Console (last 90 days):
- Queries
- Clicks
- Impressions
- CTR
- Average position

Google Analytics (last 90 days):
- Organic landing pages
- Conversions (Free Demo form submits, WhatsApp clicks, call clicks)
- Engagement rate

Keyword sources (multi-source so we don't trust any single tool):
- Google Search Console
- Ubersuggest
- Ahrefs
- SEMrush
- Google Autocomplete
- People Also Ask

**Data access constraint** — I currently have no GSC, GA, Ahrefs, or SEMrush MCPs connected. To run Phase 1 properly, give me one of:

- A connected MCP for the tool
- A CSV export dropped at `/Users/rohit/Downloads/` (Ubersuggest already follows this pattern)
- Copy-pasted rows in chat for small slices

Without inputs, Phase 1 is blocked and the queue entry stays at "Phase 1 — waiting on data" rather than skipping ahead.

**Output of Phase 1** — a `drafts/<task>/inputs/` folder with the raw exports + a one-page summary of what was collected, what's missing, and the date range.

### Phase 2 — Opportunity Scoring

For each candidate keyword, score on three axes (1–10 each) with written justification:

**Business Value (1-10)**
- Can this generate admissions? (Direct buying intent → 8-10)
- Can this generate enquiries? (Course details / fees questions → 5-7)
- Can this generate calls? (Local intent + phone-friendly query → 4-6)

**Ranking Opportunity (1-10)**
- Existing position (if we rank 11–20 → 8-10, 21–50 → 5-7, unranked → 2-4)
- Domain authority gap vs the top 5 competitors (small gap → high score)
- Content gap (clear angles competitors miss → high score)

**GEO Opportunity (1-10)**
- Likely to appear in AI search results? (Educational + factual → 7-10)
- Frequently asked in ChatGPT / Gemini / Claude / Perplexity? (Conversational phrasing → 8-10)
- Educational query (how/why/what/when/cost/best) → 6-9

**Total**

```
Priority Score = Business Value × Ranking Opportunity × GEO Opportunity
```

Maximum 1,000. Anything below 100 is auto-deprioritized unless there's a specific business reason to override. Score goes in the queue row.

**Output of Phase 2** — a scored, sorted shortlist (typically top 10–20 candidates) ready for categorization.

### Phase 3 — Categorization

Group each shortlisted opportunity into exactly one category. Category determines which workflow runs in Phase 4–5.

**A. Existing Page Optimization** — **PREFERRED**

Pick this if any existing page in `src/pages/landingPagesConfig.js` already serves the intent and ranks 1–20, OR can plausibly be tuned to do so. Cheaper, lower-risk, compounds authority.

Examples of actions:
- Improve ranking page (title, intro, headings, internal links inbound)
- Expand FAQs in `src/pages/landingPagesFaqs.js` (slug-specific array, not default)
- Add or upgrade schema (Course / FAQPage / BreadcrumbList)
- Improve entity coverage (mention related tools, platforms, certifications by name)

**B. New Landing Page**

Pick only if all three are true:
- No existing page in `landingPagesConfig.js` serves the intent (audit confirmed in Phase 1)
- No cannibalization risk vs any of the 61 existing slugs
- Expected admissions contribution ≥ 1/month after 6 months (per Tier 4 Page ROI Assessment)

Draft slug + content in `drafts/pages/<slug>/`. Never edit `landingPagesConfig.js` at this stage.

**C. Supporting Blog Content**

Pick only if:
- The post strengthens an existing course page's topical authority (the post links INTO an existing landing page, not the reverse)
- It supports a cluster from the topical map at `docs/topical-map.md`

Blog posts ship via the Supabase admin panel (`blogs` table, `is_published`). Drafts of blog content live at `drafts/blog/<slug>.md` until approved.

**D. GEO Assets**

For ultimate guides, salary reports, career roadmaps, tool comparisons, AI marketing resources. These compound authority.

Each GEO asset also gets a row in `docs/ai-citations.md` (target question, answer block, related entities, schema, target engine) per Tier 4.

If an opportunity doesn't fit any category cleanly, reject it and document why in the queue.

### Phase 4 — Approval Report

Every proposal — regardless of category — must contain the following exact fields. This format supersedes all earlier ad-hoc report requirements in Tiers 1–3.

```
Keyword:                <primary target>
Secondary keywords:     <semantically related variants>
Search intent:          Transactional | Commercial | Informational | Navigational | Local
Existing ranking URL:   <slug from landingPagesConfig.js, or "none">
Existing position:      <GSC position, or "unranked">
Competing URL:          <any internal URL that risks cannibalization>
Cannibalization risk:   <Low | Medium | High + specific reason>
Expected monthly leads: <number, conservative estimate>
Expected GEO impact:    <which engines, what kind of citation, how often>
Phase 2 score:          <Business × Ranking × GEO = total>
Recommendation:         Optimize Existing Page | Create New Page | Create Supporting Blog | Create GEO Asset | Reject
Justification:          <2-4 sentences tying the recommendation to the score and the tier rules>
Implementation plan:    <file-level changes I will make once approved>
Rollback plan:          <how we'd undo this if conversions drop, per Tier 4>
```

The report is committed to `drafts/<task>/report.md` and surfaced in chat. No implementation work begins until I get an explicit go-ahead.

### Phase 5 — Publishing

Publication runs only after every gate passes:

- [ ] Search Console review — confirmed current position + traffic data for the target keyword
- [ ] Cannibalization analysis — no existing slug serves the same intent (per Tier 2)
- [ ] Competitor benchmark — top 5 + content gap analysis (per Tier 3)
- [ ] Topical map review — page fits a cluster, internal links planned (per Tier 3)
- [ ] Conversion impact review — no degradation to lead form / WhatsApp / call paths (per Tier 4)
- [ ] Deployment Validation Checklist passed — 9 items from Tier 3
- [ ] Approval received — explicit "go ahead" / "publish" / "ship it" from you (per Tier 2 Approval Gate)

Implementation order once unblocked:

1. Move draft from `drafts/` to the live file (`src/pages/landingPagesConfig.js` entry, `src/pages/landingPagesFaqs.js` entry, blog post in Supabase, etc.)
2. Run `npm run build` and verify the new slug appears in `dist/pages/<slug>/index.html` with unique title, description, canonical, and 200+ words wrapped in `<noscript>`
3. Re-run the uniqueness check Python script across all `dist/**/index.html`
4. Confirm the `generate-sitemap.yml` workflow will include the new URL on next run (or trigger it manually)
5. Update `docs/topical-map.md` and `docs/ai-citations.md` (if applicable)
6. Move the queue row from "In progress" to "Shipped" with the deploy commit SHA

Only at step 6 do I `git push origin main`. Hostinger auto-deploys.

If any gate fails post-launch (e.g. conversions drop the next week), the rollback plan from the Phase 4 report executes immediately — I will surface the regression and propose the rollback rather than wait for you to notice.
