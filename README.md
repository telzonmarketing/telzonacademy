# Telzon Academy — Digital Marketing Website

A React + Vite + Supabase website for Telzon Academy, Nagpur.
Built with full SEO automation, keyword-targeted landing pages, and a clean blog admin dashboard.

---

## 🚀 Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/telzon-academy.git
cd telzon-academy
npm install
cp .env.example .env      # Fill in your Supabase keys
npm run dev               # → http://localhost:3000
```

---

## 📦 GitHub Setup (Step-by-Step)

### 1. Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name it `telzon-academy` (or any name)
3. Set it to **Private**
4. Click **Create repository**

### 2. Push the code

```bash
cd telzon_project
git init
git add .
git commit -m "Initial commit — Telzon Academy website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/telzon-academy.git
git push -u origin main
```

### 3. Add GitHub Secrets

Go to your repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret Name | Value |
|---|---|
| `SUPABASE_URL` | `https://lcnfnwivodzjjpykihfn.supabase.co` |
| `SUPABASE_ANON_KEY` | Your Supabase anon key |
| `GOOGLE_INDEXING_KEY` | (Optional) Google Service Account JSON for Instant Indexing API |

---

## 🗄️ Supabase Setup

### blogs table SQL

Run this in your Supabase **SQL Editor**:

```sql
create table if not exists blogs (
  id           uuid default gen_random_uuid() primary key,
  title        text not null,
  slug         text not null unique,
  category     text,
  excerpt      text,
  content      text,
  meta_title   text,
  meta_description text,
  og_title     text,
  og_description text,
  cover_image  text,
  author       text default 'Telzon Academy',
  read_time    text,
  tags         text,
  is_published boolean default false,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Row Level Security
alter table blogs enable row level security;

-- Anyone can read published blogs
create policy "Public can read published blogs"
  on blogs for select
  using (is_published = true);

-- Service role can do everything (used by admin)
create policy "Service role full access"
  on blogs for all
  using (true)
  with check (true);
```

### leads table SQL (if not already created)

```sql
create table if not exists leads (
  id         uuid default gen_random_uuid() primary key,
  full_name  text,
  email      text,
  phone      text,
  source     text,
  created_at timestamptz default now()
);
```

### SEO settings table SQL

```sql
create table if not exists "seoSettings" (
  id uuid default gen_random_uuid() primary key,
  page_key text unique,
  meta_title text,
  meta_description text,
  meta_keywords text,
  og_title text,
  og_description text,
  google_code text,
  pixel_code text,
  retargeting_code text,
  updated_at timestamptz default now()
);

alter table "seoSettings" add column if not exists google_code text;
alter table "seoSettings" add column if not exists pixel_code text;
alter table "seoSettings" add column if not exists retargeting_code text;
```

---

## 🤖 GitHub Actions — SEO Automation

Two workflows run automatically:

### `daily-seo.yml` — Runs every day at 6 AM IST
- Builds the website and runs the advanced SEO Brain audit
- Crawls sitemap URLs and writes Markdown/JSON reports to GitHub Actions artifacts
- Pings Google and Bing with your sitemap
- Submits sitemap URLs to IndexNow when `INDEXNOW_KEY` is configured
- Optionally sends priority URLs to Google Indexing API when `GOOGLE_INDEXING_KEY` is configured

### `generate-sitemap.yml` — Runs every Sunday
- Fetches all published blog posts from Supabase
- Regenerates `public/sitemap.xml` with all pages + blog posts
- Commits and pushes the updated sitemap
- Pings Google with the new sitemap

You can also trigger either workflow manually from **GitHub → Actions → Run workflow**.

---

## 🔐 Admin Dashboard

- **Blog Admin:** `/admin/blogs` → Password: `9923022925`
- **Leads Admin:** `/private-free-demo-leads-94f7c1a2d3`
- **SEO/Tracking Settings:** `/admin` or `/seo-settings-dashboard-telzon-secret-2024`
- **Lead Generation Page:** `/lead-generation-package` or `/free-demo`

All admin pages are `noindex, nofollow` — search engines will never see them.

---

## 📍 Landing Pages

All pages are at `/pages/:slug`. Currently configured:

| Slug | Target Keyword |
|---|---|
| `/lead-generation-package` | Free digital marketing career counselling |
| `digital-marketing-course-in-nagpur` | Digital marketing course in Nagpur |
| `digital-marketing-institute-in-nagpur` | Digital marketing institute in Nagpur |
| `best-digital-marketing-course-in-nagpur` | Best digital marketing course Nagpur |
| `digital-marketing-course-fees-in-nagpur` | Digital marketing course fees |
| `digital-marketing-course-with-placement-nagpur` | Course with placement |
| `online-digital-marketing-course-nagpur` | Online course |
| `seo-course-in-nagpur` | SEO course Nagpur |
| `social-media-marketing-course-nagpur` | Social media course |
| `google-ads-course-nagpur` | Google Ads course |
| *(+ 8 more)* | *(see `landingPagesConfig.js`)* |

To add a new landing page, simply add an entry to `src/pages/landingPagesConfig.js`.

---

## 🏗️ Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS** + **Radix UI** components
- **Framer Motion** for animations
- **Supabase** for database (blogs + leads)
- **react-helmet** for SEO meta tags
- **GitHub Actions** for daily SEO automation

---

## 📈 SEO Checklist

- [x] Unique meta title + description on every page
- [x] Open Graph + Twitter Card tags everywhere
- [x] Canonical tags on all pages
- [x] JSON-LD structured data (EducationalOrganization + BlogPosting)
- [x] XML sitemap with all pages
- [x] robots.txt blocking admin pages
- [x] Admin pages noindex/nofollow
- [x] Footer links replaced with real URLs
- [x] Daily sitemap ping via GitHub Actions
- [x] Blog admin with SEO score checker
- [x] Admin tracking fields for Google tags, Meta Pixel and retargeting snippets
- [x] Daily SEO Brain audit with crawl reports in GitHub Actions
- [ ] Submit sitemap in [Google Search Console](https://search.google.com/search-console)
- [ ] Add Google Indexing API key for instant indexing

---

## 📞 Contact

**Telzon Academy** — Nagpur, Maharashtra  
Phone: +91 93071 89776  
Email: connect@telzonacademy.in
