# Telzon Academy — Full Setup Guide

## 1. Push to GitHub

```bash
# In your project folder (where package.json is):
git init
git add .
git commit -m "feat: Zomato SEO strategy + AI blog admin + daily indexing automation"

# Create a new repo on github.com called "telzon-academy" then:
git remote add origin https://github.com/YOUR_USERNAME/telzon-academy.git
git branch -M main
git push -u origin main
```

---

## 2. Supabase — Required Tables

Go to **Supabase → SQL Editor** and run:

```sql
-- Blogs table (if not already created)
create table if not exists blogs (
  id uuid default gen_random_uuid() primary key,
  title text,
  slug text unique,
  category text,
  excerpt text,
  content text,
  meta_title text,
  meta_description text,
  og_title text,
  og_description text,
  cover_image text,
  author text default 'Telzon Academy',
  read_time text,
  tags text,
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Allow public reads on published blogs
alter table blogs enable row level security;
create policy "Public read published blogs"
  on blogs for select using (is_published = true);

-- Allow all operations from anon key (admin uses same key)
create policy "Admin full access"
  on blogs for all using (true) with check (true);

-- SEO settings table
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

-- If the seoSettings table already exists, run these once:
alter table "seoSettings" add column if not exists google_code text;
alter table "seoSettings" add column if not exists pixel_code text;
alter table "seoSettings" add column if not exists retargeting_code text;

-- Leads table
create table if not exists leads (
  id uuid default gen_random_uuid() primary key,
  full_name text,
  email text,
  phone text,
  source text,
  created_at timestamptz default now()
);
```

---

## 3. GitHub Secrets — Add these in Settings → Secrets → Actions

| Secret Name       | Value                                                    |
|-------------------|----------------------------------------------------------|
| `SUPABASE_URL`    | `https://lcnfnwivodzjjpykihfn.supabase.co`              |
| `SUPABASE_ANON_KEY` | Your Supabase anon key from Project Settings → API    |
| `INDEXNOW_KEY`    | Any random 32-char string, e.g. `telzon2025seokey12345` |

---

## 4. IndexNow Key File

Create a file at `public/YOUR_INDEXNOW_KEY.txt` containing just the key:

```
telzon2025seokey12345
```

This allows Bing/Yandex to verify your site ownership for instant indexing.

---

## 5. Google Search Console

1. Go to https://search.google.com/search-console
2. Add property → `https://telzonacademy.in`
3. Verify via HTML file or DNS
4. Submit sitemap → `https://telzonacademy.in/sitemap.xml`
5. Request indexing for your homepage manually first

---

## 6. Deploy to Hostinger

```bash
npm run build
```
Upload the `dist/` folder contents to Hostinger public_html via File Manager or FTP.

---

## 7. Admin Panel URL

- **Blog Admin**: `https://telzonacademy.in/admin/blogs`
- **Password**: `9923022925`
- **Leads Admin**: `https://telzonacademy.in/private-free-demo-leads-94f7c1a2d3`
- **Lead Generation Page**: `https://telzonacademy.in/lead-generation-package`
- **Free Demo Alias**: `https://telzonacademy.in/free-demo`

---

## 8. Daily SEO Automation

The GitHub Action at `.github/workflows/daily-seo.yml` runs every day at 6 AM IST and:
- Builds the site to catch SEO-breaking code errors
- Runs the advanced SEO Brain audit
- Crawls every sitemap URL and checks live status, response time and response size
- Uploads Markdown + JSON reports in GitHub Actions artifacts
- Adds the SEO report to the GitHub job summary
- Pings Google + Bing with your sitemap
- Submits sitemap URLs to IndexNow when `INDEXNOW_KEY` is configured
- Optionally submits priority URLs to Google Indexing API when `GOOGLE_INDEXING_KEY` is configured

You can also trigger it manually from GitHub → Actions → "Daily SEO Brain — Audit, Crawl & Indexing" → Run workflow.

---

## 9. Creating AI Blog Posts (Daily Workflow)

1. Go to `/admin/blogs`
2. Click **New Post**
3. Open **AI Blog Generator** panel
4. Enter a keyword like "digital marketing course in Nagpur 2025"
5. Click **Generate** — full 1000-word post is written automatically
6. Review, edit, add cover image from Unsplash
7. Check SEO score panel (aim for 80+)
8. Click **Publish Now**

The GitHub Action will automatically ping Google/Bing with the new URL that night.

---

## SEO Score Target: 100/100

Each blog post needs:
- ✅ Title 50–70 characters with keyword
- ✅ Meta description 150–160 chars with keyword
- ✅ Content 800+ words
- ✅ Excerpt 80+ characters  
- ✅ Cover image URL set
- ✅ OG Title + OG Description filled
- ✅ Category selected
- ✅ Tags added (6–8)
- ✅ Keyword in title and meta description
- ✅ Internal link to `/pages/digital-marketing-course-in-nagpur`
