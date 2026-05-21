# Telzon SEO Platform — Client Onboarding

This folder holds the configuration for every client managed by the
multi-tenant SEO bot. Each client = one subfolder = one `config.json`.

## Add a new client (5 minutes)

1. **Copy the template:**
   ```bash
   cp -r clients/_template clients/<client-slug>
   ```
   `<client-slug>` becomes the URL slug — keep it lowercase, hyphenated,
   no spaces (e.g. `acme-marketing`, `pune-bakery`).

2. **Edit `clients/<client-slug>/config.json`:**
   - `slug` → must match folder name
   - `name` → client's business name
   - `site.url` → their website (no trailing slash)
   - `nap.*` → their Name, Address, Phone (the SAME values you'll
     paste into every directory submission)
   - `access.dashboardPassword` → strong password you'll share with them
   - `branding.*` → optional white-label colors + logo
   - `features.*` → enable/disable AEO, blitz, AI brain per their tier

3. **Add their credentials as GitHub secrets** (only if they have them):
   - GSC service account JSON  →  secret name in
     `credentials.gscServiceAccountSecret`
   - Bing Webmaster API key   →  secret name in
     `credentials.bingApiKeySecret`

   These secrets must be added in:
   `https://github.com/telzonmarketing/telzonacademy/settings/secrets/actions`

4. **Commit + push:**
   ```bash
   git add clients/<client-slug>/
   git commit -m "feat(clients): onboard <client-slug>"
   git push
   ```

5. **Wait or trigger the workflow:**
   - The bot picks up the new client at the next cron (within 1 hour).
   - Or trigger manually:
     https://github.com/telzonmarketing/telzonacademy/actions/workflows/seo-multi-client.yml

6. **Share dashboard URL with client:**
   ```
   https://telzonacademy.in/clients/dashboard.html?client=<client-slug>
   ```
   Tell them the password you set in `access.dashboardPassword`.

## Folder conventions

- `_template/`  → template, never runs (skipped by the registry)
- Folders starting with `_` or `.` are skipped
- Setting `active: false` in a config disables that client without deleting

## Where the data goes

- Bot reads:  `clients/<slug>/config.json`
- Bot writes: `public/clients/<slug>/seo-reports/*.json`
- Dashboard:  `https://telzonacademy.in/clients/dashboard.html?client=<slug>`
- Admin:      `https://telzonacademy.in/clients/admin/`

## Updates

Push code changes to `seo-indexing-agent/src/` → next cron run = all
clients benefit. Single codebase, all clients share improvements.
