# Telzon Academy — Backend & Admin Setup

This site uses **Supabase** for data + auth + Edge Functions, **Meta Pixel + CAPI** for ad tracking, **Resend** for lead-notification email, and **GitHub Actions → FTP → Hostinger** for deploys.

Once-only setup is below. After that, every push to `main` rebuilds and uploads `dist/` to Hostinger.

---

## 1. Supabase — already wired

Project: `lcnfnwivodzjjpykihfn` (Tokyo / ap-northeast-1).

**Tables managed by the app:** `leads`, `blogs`, `seoSettings`, `videos`, `hiring_companies`. RLS is on for all of them. Public site-visitors can:

- Read published blogs / SEO settings / videos / hiring companies
- Insert into `leads`

The admin (email = `telzoncilentsbusiness@gmail.com`) can do everything else.

**Edge Functions deployed:**

| Function | Path | Purpose |
| --- | --- | --- |
| `submit-lead` | `POST /functions/v1/submit-lead` | Persists lead → fires Meta CAPI Lead → emails admin via Resend. Public (no JWT). |
| `meta-stats` | `GET /functions/v1/meta-stats?date_preset=last_30d` | Admin-only Meta Marketing API insights (spend / leads / CPL by campaign). |

### 1a. Create your admin user

In the Supabase dashboard → **Authentication → Users → Add user → email/password**, create:

- email: `telzoncilentsbusiness@gmail.com`
- password: anything you want (you'll use this on `/admin/login`)
- ✅ "Auto Confirm User"

Anyone signing in with any other email is rejected by `AdminGuard`.

### 1b. Set Edge Function secrets

In **Supabase → Project settings → Edge Functions → Secrets**, add:

| Key | Required for | Value |
| --- | --- | --- |
| `ADMIN_EMAIL` | email + admin gate | `telzoncilentsbusiness@gmail.com` |
| `META_PIXEL_ID` | Meta CAPI | numeric Pixel ID from Events Manager |
| `META_CAPI_TOKEN` | Meta CAPI | Conversions API access token (Events Manager → Settings → Generate Access Token) |
| `META_TEST_EVENT_CODE` | optional | Pastes events into the Test Events tab while testing |
| `META_AD_ACCOUNT_ID` | Marketing API dashboard | e.g. `1234567890` (or `act_1234567890`) |
| `META_MARKETING_TOKEN` | Marketing API dashboard | system-user token with `ads_read` scope |
| `RESEND_API_KEY` | lead emails | Resend API key (re_…) |
| `RESEND_FROM_EMAIL` | lead emails | `"Telzon Leads <leads@yourdomain.com>"` (verify the domain in Resend, or use `onboarding@resend.dev` while testing) |

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are pre-populated by Supabase — you don't add them.

Until you fill `META_PIXEL_ID + META_CAPI_TOKEN`, leads still save and emails still send; only CAPI is skipped.

---

## 2. Meta Pixel — client-side

The site reads your full Pixel snippet from `seoSettings.pixel_code` and injects it into `<head>` on every public page (`TrackingScripts.jsx`). Open `/admin/seo` → **Tracking** tab → paste the snippet Meta gives you in **Events Manager → Pixel → Continue Pixel Setup → Install code manually** → **Save**.

Once that's in, every form submission also fires `fbq('track', 'Lead')` client-side, deduped server-side by event_id with the CAPI call.

---

## 3. GitHub repo — `telzon academy`

### 3a. Push the code

```bash
cd "final code telzon academy"
git init
git add .
git commit -m "Backend: leads + admin + Meta CAPI + Resend"
git branch -M main
git remote add origin git@github.com:<your-username>/telzon-academy.git
git push -u origin main
```

### 3b. Add repo secrets

GitHub → repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Key | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://lcnfnwivodzjjpykihfn.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | the long anon JWT from Supabase Settings → API |
| `VITE_META_PIXEL_ID` | optional, your numeric pixel ID (only needed if you bake it in at build time instead of via SEO settings) |
| `FTP_SERVER` | from Hostinger → **Files → FTP Accounts** (e.g. `ftp.yourdomain.com` or `123.45.67.89`) |
| `FTP_USERNAME` | full FTP username (looks like `u123456789.yourdomain`) |
| `FTP_PASSWORD` | the FTP password you set in Hostinger |
| `FTP_SERVER_DIR` | usually `public_html/` (omit to use default) |

The workflow is `.github/workflows/deploy.yml` — runs on push to `main` and via "Run workflow" in Actions.

---

## 4. Hostinger — verify FTP access

In Hostinger control panel: **Websites → Manage → Files → FTP Accounts**. Note the host, username, and either set or look up the password. Make sure the path you give to `FTP_SERVER_DIR` is the real web root for your domain — usually `public_html/`, sometimes `domains/<yourdomain>/public_html/`.

The `.htaccess` file in `public/` handles SPA routing once it's deployed (it's already correct).

---

## 5. Admin URLs

- `/admin/login` — Supabase email/password login
- `/admin` — overview (leads + posts)
- `/admin/leads` — leads inbox, status, notes, CSV export, WhatsApp deep-links
- `/admin/blogs` — full blog CRUD with AI generator
- `/admin/seo` — meta tags, OG, **Pixel/Tracking code** (paste your full Meta Pixel snippet here)
- `/admin/videos` — videos CRUD
- `/admin/meta-ads` — live Meta Marketing API dashboard

The legacy `/private-free-demo-leads-94f7c1a2d3` and `/seo-settings-dashboard-telzon-secret-2024` URLs now redirect into the proper auth-protected admin.

---

## 6. Testing the full lead flow

1. Open the homepage in a private window with `?utm_source=test&utm_campaign=qa&fbclid=qa123`
2. Submit any of: contact form, free-demo registration, lead-gen form
3. Open `/admin/leads` — your lead is at the top with UTM, page URL, fbclid captured
4. Check your inbox — you should get the `📥 New Telzon lead: …` Resend email (once `RESEND_API_KEY` is set)
5. Open Meta Events Manager → **Test Events** tab and watch Lead events arrive (use `META_TEST_EVENT_CODE` while testing)

---

## Troubleshooting

- **`/admin/login` keeps bouncing back** → no admin user yet, see step 1a.
- **Leads don't save** → check Supabase logs (Functions → submit-lead). The fallback path in `leadSubmit.js` will use direct insert; if RLS blocks it, you'll see "new row violates row-level security" — verify the migration ran.
- **Meta Ads page says "Meta credentials not configured"** → set `META_AD_ACCOUNT_ID` + `META_MARKETING_TOKEN` Edge Function secrets and refresh.
- **Resend says "domain not verified"** → use `onboarding@resend.dev` as the From while you're verifying the domain.
- **GitHub Action fails on FTP** → verify `FTP_SERVER` is the host, not a URL with `https://`. Usually no port. Try the FTP credentials with FileZilla first.
