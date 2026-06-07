# Telzon Academy — Project Handoff Brief

**Copy-paste this entire file at the start of a new Claude session.** It gives the next agent everything they need to get to work without re-discovering the project.

For deeper governance + execution rules, the next agent should also read `CLAUDE.md` in the repo root (this brief points at it).

Last updated: 2026-06-07 (commit `66bf383`)

---

## 1. What this project is

**Telzon Academy** — Nagpur's digital marketing training institute. Vite + React + Tailwind SPA with a Supabase backend, deployed to Hostinger shared hosting, with a sister-agency (Telzon Marketing) that runs the SEO bot and developer-credit backlink.

Live: **https://telzonacademy.in**

---

## 2. Where everything lives

| What | Where |
|------|-------|
| Local repo on this Mac | `/Users/rohit/Downloads/telzonacademy/` |
| GitHub repo | `https://github.com/telzonmarketing/telzonacademy` |
| GitHub org | `telzonmarketing` |
| Active branch | `main` |
| Production URL | `https://telzonacademy.in` |
| Hosting provider | **Hostinger** (shared web hosting plan) |
| Hostinger panel | `https://hpanel.hostinger.com` |
| Hostinger SSH details | hPanel → Advanced → SSH Access (currently `srv1326-files.hstgr.io`, user `u616815166`, port 65002 — but the GH Actions SCP deploy times out, see §5) |
| Hostinger file root | `public_html/` under user `u616815166` |
| Domain registrar | Hostinger (same account) |
| DNS A records | `93.127.173.220`, `91.108.106.233` (Hostinger IPs, **no Cloudflare**) |
| Supabase project | `lcnfnwivodzjjpykihfn` in org `chvzdofqelkdlnzybwnd` (region ap-northeast-1, ACTIVE_HEALTHY) |
| Supabase URL | `https://lcnfnwivodzjjpykihfn.supabase.co` (hardcoded in `src/lib/customSupabaseClient.js`) |
| Supabase dashboard | `https://supabase.com/dashboard/project/lcnfnwivodzjjpykihfn` |

---

## 3. Tech stack

- **Build**: Vite 4.5 + Node 20 (see `.nvmrc`)
- **UI**: React 18 + react-router-dom (SPA, multiple landing routes)
- **Styling**: Tailwind CSS 3.4 with custom design tokens in `src/index.css` + `tailwind.config.js`
- **Animation**: Framer Motion + Locomotive Scroll (smooth scroll lib that hijacks `window.scroll` — see §10 gotcha)
- **SEO head**: react-helmet (runtime per-route head rewrites) + post-build prerender script (`tools/prerender.js`)
- **Backend**: Supabase (REST + Realtime via `@supabase/supabase-js`)
- **Analytics / tracking**: GTM `GTM-58FF9WVF`, GA4 `G-R1JR4H02F1` / `GT-5DHFK99D`, Meta Pixel `1920151015239658`
- **Brand contact**: `+91 93071 89776` · `connect@telzonacademy.in`

---

## 4. Build & deploy pipeline (THIS IS CRITICAL)

### Build command

```bash
npm run build
# = vite build && node tools/prerender.js
```

This emits 63 static HTML files under `dist/`:
- `dist/index.html` (homepage, unmodified Vite output)
- `dist/blog/index.html`, `dist/lead-generation-package/index.html`
- `dist/pages/<slug>/index.html` × 61 landing pages

Each prerendered route has its own unique title, description, canonical, OG tags, plus 200+ words of static fallback content wrapped in `<noscript>` (so JS users don't see FOUC but no-JS crawlers still see SEO copy).

Landing page slugs + metadata: `src/pages/landingPagesConfig.js`
Per-slug FAQs (shared with prerender): `src/pages/landingPagesFaqs.js`

### Two deploy mechanisms (only one actually works right now)

1. **Hostinger Git auto-deploy** ✅ — Hostinger has its own GitHub integration that pulls from `main` and builds on their server. Lands ~12–52 seconds after `git push origin main`. This is what actually ships changes.
2. **`.github/workflows/deploy.yml` SCP** ❌ — Tries to SCP `dist/` to Hostinger over SSH port 65002. **Currently times out** (`dial tcp ***:65002: i/o timeout`). Has been failing on every push for at least a week. Not blocking — Hostinger's own integration covers it. Either disable the workflow or fix the SSH creds when you have time.

### .htaccess (in `public/.htaccess`)

- 301 redirects `/index.html` → `/` (Q-001 cannibalization fix already shipped)
- SPA fallback to `index.html` for non-file routes
- Cache headers for static assets

### Other automated workflows in `.github/workflows/`

A bunch of SEO bot workflows (`daily-seo.yml`, `seo-heartbeat.yml`, `seo-aeo-agent.yml`, `seo-blitz`, etc.) that commit to `public/seo-reports/`, `public/llms.txt`, `public/llms-full.txt`, `public/clients/`. These run automatically and add commits to `main`. **Always `git pull --rebase origin main` before pushing** because of these — there will usually be SEO bot commits to rebase past.

---

## 5. Tracked accounts on the live site

| Account | ID/key | Where |
|---------|--------|-------|
| Google Tag Manager | `GTM-58FF9WVF` | `index.html` |
| GA4 (gtag) | `GT-5DHFK99D` → links `G-R1JR4H02F1` | `index.html` |
| Meta Pixel | `1920151015239658` | `index.html` + `src/lib/leadSubmit.js` |
| Bing Webmaster verification | file `public/6sc3cjicy5gsa97kfb5dlwb3idjpo7.html` (Bing token) | served at root |
| Supabase | anon key hardcoded in `src/lib/customSupabaseClient.js` (public-safe) | runtime |

### Secrets in GitHub Actions (names only — values are in GH Secrets UI)

`BING_API_KEY`, `FTP_PASSWORD`, `FTP_SERVER`, `FTP_SERVER_DIR`, `FTP_USERNAME`, `GH_TOKEN`, `GOOGLE_SERVICE_ACCOUNT_KEY`, `META_CAPI_TOKEN`, `SITE_URL`, `SSH_PRIVATE_KEY`

The `FTP_*` set is used by the failing SCP deploy. Updating them won't break the working Hostinger Git pipeline.

---

## 6. Supabase schema (what touches the runtime UI)

Tables actively read/written by the React app:

| Table | Used by | Purpose |
|-------|---------|---------|
| `seoSettings` | `src/components/GlobalSeo.jsx` | Runtime override of homepage `<title>` + meta description. `page_key='home'` is the active row. **Editing this row is one of the only ways to change homepage SEO without a deploy.** |
| `blogs` | `src/components/BlogList.jsx` | Blog index reads `is_published=true` ordered by `created_at desc`. |
| `hiring_companies` | `src/components/WelcomeMessage.jsx` | Marquee logos for "Our Students Work At" carousel. |
| `leads` (or similar — verify via `list_tables`) | `src/lib/leadSubmit.js` `submitLead()` | Free Demo form submissions land here. |

To inspect / edit, use the Supabase MCP if connected:
- `mcp__b862445f-b21d-4b91-8f2e-9a781aff7452__list_tables` with `project_id: "lcnfnwivodzjjpykihfn"`
- `mcp__b862445f-b21d-4b91-8f2e-9a781aff7452__execute_sql` for SELECT/UPDATE

---

## 7. Conversion paths (do not break these — Tier 4 #1)

In priority order:

| # | Path | Code location | Tracker fires |
|---|------|---------------|---------------|
| 1 | **Free Demo lead form** | `src/components/FreeDemoRegistration.jsx` → `src/lib/leadSubmit.js` `submitLead()` | Meta CAPI `Lead` + Supabase row |
| 2 | WhatsApp click | `handleCTAClick` / `handleWhatsAppClick` → `https://wa.me/919307189776?text=...` | Meta CAPI `Contact` (custom) |
| 3 | Call click | `tel:+919307189776` (Footer + contact sections) | None (native dial) |
| 4 | Location click | `handleLocationClick` in `Header.jsx` → opens Google Maps share link | Meta CAPI `Schedule` via `firePixelSchedule` |
| 5 | Lead-gen package CTA | `/lead-generation-package` route (separate B2B funnel) | Meta CAPI `Lead` (B2B) |

The Header's primary "Free Demo" button links to `/lead-generation-package` — every change to the Header must preserve that flow.

---

## 8. Currently shipped — recent commits

| Commit | What |
|--------|------|
| `66bf383` | Favicon cache-bust `?v=2` — forces Google to refresh its 16×16 cached favicon to the new 192×192 mark |
| `9d8dc29` | Telzon Marketing developer-credit backlink in Footer (dofollow, target keyword anchor) |
| `05c5c9c` | **Q-001 cannibalization fix** — homepage retitled brand-first, landing page strengthened with new title + 8 bullets + slug-specific FAQs + 3 GEO blocks (DirectAnswer, CourseFacts, CareerOutcomes), internal links from Hero + FinalCTA + Footer, RelatedPagesSection pinned cluster canonical |
| (Supabase) | `seoSettings` row `page_key='home'` updated to match the new homepage title/description (mirrors `index.html`) |

GSC baseline + post-deploy comparison sheet: `drafts/2026-06-07-cannibalization-fix/baseline.md` (gitignored, local-only).
T+0 SERP HTML snapshots: `drafts/2026-06-07-cannibalization-fix/pre-deploy-snapshot/`.

---

## 9. Active queue (full ledger in `drafts/queue.md`)

| # | Task | Phase | Score | Status |
|---|------|-------|------:|--------|
| Q-001 | Homepage vs landing-page authority consolidation | 5 ✅ shipped | 648 | Live 2026-06-07 |
| Q-002 | Strengthen `/pages/digital-marketing-classes-in-nagpur` (pos 24, 266 imps) | 3 — categorized | 392 | Backlog |
| Q-003 | Defend `best digital marketing course in nagpur` (pos 7.4) — CTR fix | 3 — categorized | 324 | Backlog |
| Q-004 | Defend `digital marketing institute in nagpur` (pos 8.8) — CTR fix | 3 — categorized | 324 | Backlog |
| Q-005 | Brand SERP lockdown via "About Telzon Academy" GEO asset | 3 — categorized | 400 | Backlog · pending favicon re-crawl + GA4 data |
| Q-006 | Extend prerender to include DirectAnswer/CourseFacts/CareerOutcomes in `<noscript>` fallback | 3 — categorized | 240 | Backlog |
| Q-007 | Developer-credit backlink to Telzon Marketing | 5 ✅ shipped | — | Live 2026-06-07 |

---

## 10. Standing rules — read `CLAUDE.md` for the full version

`CLAUDE.md` in the repo root has the operational rulebook. It's 690 lines across:

- **Tier 1** — Advanced SEO Expansion Strategy (what can be targeted)
- **Tier 2** — Standing Rules (safety + approval gate)
- **Tier 3** — Enterprise SEO Governance (Search Console First, competitor benchmark, deploy validation)
- **Tier 4** — Business Impact (admissions > traffic, conversion protection)
- **5-phase Execution Queue** — Data → Score → Categorize → Approval Report → Publish

**Key rules you must follow:**

1. **No publishing without explicit approval.** Drafts in `drafts/` are free; touching `landingPagesConfig.js`, `App.jsx` routes, `prerender.js` routes, sitemap, or `git push origin main` requires a clear "go ahead" / "ship it" from the user.
2. **No new URLs without justification.** Tier 3 Search Console First Rule: if a target keyword has an existing page in pos 1–20, **optimize it, don't create a new page**.
3. **Conversion paths win over SEO.** If any change risks dropping Free Demo submissions / WhatsApp clicks / calls, surface the tradeoff first.
4. **Always `git pull --rebase origin main` before pushing.** SEO bots commit to main automatically.
5. **Don't touch `public/seo-reports/`, `public/llms*.txt`, `public/clients/`** — owned by SEO bots, will conflict.

---

## 11. Quick command cheatsheet

```bash
# Working directory
cd /Users/rohit/Downloads/telzonacademy

# Verify clean status (then pull, since SEO bots commit often)
git status && git pull --rebase origin main

# Build + prerender
npm run build

# Verify uniqueness across all prerendered routes
python3 -c "
import re, glob
from collections import Counter
files = sorted(glob.glob('dist/index.html') + glob.glob('dist/blog/index.html') +
               glob.glob('dist/lead-generation-package/index.html') + glob.glob('dist/pages/*/index.html'))
titles = [re.search(r'<title>([^<]+)', open(f).read()).group(1) for f in files]
print('Duplicate titles:', sum(v-1 for v in Counter(titles).values() if v > 1))
print('Routes:', len(files))
"

# Live homepage title / favicon sanity check
curl -sL https://telzonacademy.in/ | grep -oE '<title>[^<]+</title>|<link rel="icon"[^>]+>'

# Watch Google's favicon cache (returns 192×192 when refresh has landed)
curl -sL "https://www.google.com/s2/favicons?domain=telzonacademy.in&sz=64" -o /tmp/g.png && sips -g pixelWidth /tmp/g.png

# Watch GH Actions deploy (the failing SCP one)
gh run list --repo telzonmarketing/telzonacademy --workflow=deploy.yml --limit 3

# Trigger Hostinger pull-deploy
git push origin main   # Hostinger picks up ~12–52s later

# Inspect Supabase via MCP (if connected)
# mcp__b862445f-...__execute_sql with project_id: lcnfnwivodzjjpykihfn
```

---

## 12. Known gotchas / things future-you will hit

| Gotcha | What happens | Workaround |
|--------|-------------|------------|
| Locomotive Scroll hijacks `window.scrollY` | `window.scrollY` reports stale values; `scrollTo()` doesn't always work as expected | Use `Element.scrollIntoView({block:'center', behavior:'instant'})` instead |
| SEO bots commit to `main` constantly | `git push` will fail with "behind by N commits" | Always `git pull --rebase origin main` first |
| Homepage title is overridden at runtime by Supabase | Static title in `index.html` is what crawlers see; React renders Supabase value for users | Update **both** the static file AND the `seoSettings` row when changing homepage SEO |
| `.github/workflows/deploy.yml` SCP fails | You'll get GitHub Actions failure emails on every push | Ignore — Hostinger's own Git integration deploys successfully. Fix the SSH creds when you have time, or disable the workflow |
| `dist/` is gitignored | Build artifacts never get committed | Correct — Hostinger builds from source |
| `drafts/` is gitignored | Draft reports, queue ledger, baselines stay local | Drafts are user-facing only; not for sharing across machines |
| `.claude/` is gitignored | Local IDE config doesn't leak | Don't try to commit it |
| Facebook CAPI + tawk.to errors in dev console | "Failed to fetch" spam from localhost | Unrelated to code; these are pre-existing and benign |
| Prerender script only modifies `<title>` / `<meta name="description">` / canonical / OG | Other `<head>` content (favicons, GTM, theme-color) inherits from base `index.html` unchanged | Edit `index.html` directly for non-route-specific head changes |
| `/index.html` was indexed separately by Google | Caused authority split, now 301-redirected via `.htaccess` | If GSC still shows it, request URL Inspection for `/index.html` |

---

## 13. First message template (paste into a fresh Claude session)

> I'm working on Telzon Academy — a Vite+React+Tailwind+Supabase digital marketing institute site at `/Users/rohit/Downloads/telzonacademy/`. Live at `https://telzonacademy.in`. GitHub repo `telzonmarketing/telzonacademy`, branch `main`, auto-deploys to Hostinger ~52s after push. Supabase project `lcnfnwivodzjjpykihfn`.
>
> Read `docs/PROJECT-HANDOFF.md` and `CLAUDE.md` in the repo root before doing anything. They have the full ruleset, design tokens, conversion paths, active queue, and gotchas.
>
> Today's task: **[describe what you want me to do]**

Then attach any relevant exports (GSC, GA4, Ubersuggest) and describe the scope.

---

## 14. When in doubt

- **Don't push without explicit approval.** This is hardcoded in CLAUDE.md Tier 2.
- **Don't create new URLs without a Phase 4 Approval Report.** Tier 3 Search Console First Rule.
- **Surface every tradeoff.** If a fix risks a conversion path drop, ask before doing it.
- **Use the SEO Execution Queue.** Don't fly without it on non-trivial work.
