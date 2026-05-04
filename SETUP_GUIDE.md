# ╔══════════════════════════════════════════════════════════╗
# ║   TELZON ACADEMY — COMPLETE SETUP GUIDE                 ║
# ╚══════════════════════════════════════════════════════════╝

## STEP 1 — REPLACE YOUR FILES (this is why nothing changed)

You need to copy the files from this zip INTO your existing project.
Do NOT open the zip and run it separately — copy into your current folder.

Your project is probably at:
  ~/Desktop/telzon_project/   or
  ~/Documents/telzon_project/

**Exact files to copy-paste (replace existing):**

| File in this zip                                    | Copy to your project                         |
|-----------------------------------------------------|----------------------------------------------|
| src/components/AdminBlogs.jsx                       | src/components/AdminBlogs.jsx                |
| src/components/BlogList.jsx                         | src/components/BlogList.jsx                  |
| src/components/BlogPost.jsx                         | src/components/BlogPost.jsx                  |
| src/components/Footer.jsx                           | src/components/Footer.jsx                    |
| src/components/GlobalSeo.jsx                        | src/components/GlobalSeo.jsx                 |
| src/components/HiddenAdminLeads.jsx                 | src/components/HiddenAdminLeads.jsx          |
| src/pages/LandingPage.jsx                           | src/pages/LandingPage.jsx                    |
| src/pages/landingPagesConfig.js                     | src/pages/landingPagesConfig.js              |
| index.html                                          | index.html                                   |
| public/sitemap.xml                                  | public/sitemap.xml                           |
| public/robots.txt                                   | public/robots.txt                            |
| .github/workflows/daily-seo.yml                     | .github/workflows/daily-seo.yml              |
| .github/workflows/generate-sitemap.yml              | .github/workflows/generate-sitemap.yml       |
| .gitignore                                          | .gitignore                                   |
| .env.example                                        | .env.example                                 |

After copying, run:
  npm run dev

Then visit:
  http://localhost:3000/admin/blogs          ← Blog admin (password: 9923022925)
  http://localhost:3000/pages/digital-marketing-course-in-nagpur  ← Landing page
  http://localhost:3000/blog                 ← Blog list

---

## STEP 2 — PUSH TO GITHUB

```bash
# Inside your project folder:
git init
git add .
git commit -m "Telzon Academy — full SEO + blog admin"
git branch -M main

# Go to github.com → New Repository → name it "telzon-academy" → Private → Create
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/telzon-academy.git
git push -u origin main
```

---

## STEP 3 — ADD GITHUB SECRETS (for daily SEO automation)

1. Go to your GitHub repo
2. Click Settings → Secrets and variables → Actions → New repository secret

Add these 2 secrets:

| Name              | Value                                            |
|-------------------|--------------------------------------------------|
| SUPABASE_URL      | https://lcnfnwivodzjjpykihfn.supabase.co         |
| SUPABASE_ANON_KEY | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjbmZud2l2b2R6ampweWtpaGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MTUxNDYsImV4cCI6MjA4MTM5MTE0Nn0.8tcOMzqCHKcfB82rUcTCjeFq0X8-3p2urQL0GQ778dE |

---

## STEP 4 — SUPABASE TABLE (run once in SQL Editor)

Go to supabase.com → your project → SQL Editor → paste and run:

```sql
create table if not exists blogs (
  id               uuid default gen_random_uuid() primary key,
  title            text not null default '',
  slug             text not null unique default '',
  category         text default '',
  excerpt          text default '',
  content          text default '',
  meta_title       text default '',
  meta_description text default '',
  og_title         text default '',
  og_description   text default '',
  cover_image      text default '',
  author           text default 'Telzon Academy',
  read_time        text default '',
  tags             text default '',
  is_published     boolean default false,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- Allow public read of published posts
alter table blogs enable row level security;
create policy "Public read published" on blogs for select using (is_published = true);
create policy "Admin full access" on blogs for all using (true) with check (true);
```

---

## STEP 5 — VERIFY AUTOMATION IS RUNNING

After pushing to GitHub:
1. Go to your repo → Actions tab
2. Click "Daily SEO – Sitemap Ping" → Run workflow (blue button)
3. Watch it run — it should show green checkmarks

It will now run automatically every day at 6 AM IST.

---

## WHAT'S INCLUDED

### Blog Admin (/admin/blogs)
- Password: 9923022925
- Clean lock screen
- Stats dashboard (Total / Published / Drafts)
- Search & filter posts
- 3-tab editor: Content | SEO | Settings
- Live SEO Score (0-100) with 10 checks
- HTML toolbar (H2, H3, Bold, Italic, Lists, Links)
- Word count + read time
- Google search preview (see how it looks in Google)
- Cover image preview
- Auto-fill: title → slug, meta title, OG title
- Live preview before publishing
- One-click Publish or Save Draft

### Landing Pages (17 pages)
/pages/digital-marketing-course-in-nagpur
/pages/digital-marketing-institute-in-nagpur
/pages/best-digital-marketing-course-in-nagpur
/pages/digital-marketing-course-fees-in-nagpur
/pages/digital-marketing-course-with-placement-nagpur
/pages/digital-marketing-training-institute-nagpur
/pages/digital-marketing-classes-in-nagpur
/pages/digital-marketing-course-for-beginners-nagpur
/pages/digital-marketing-course-duration-nagpur
/pages/digital-marketing-academy-in-nagpur
/pages/digital-marketing-training-in-nagpur
/pages/digital-marketing-course-near-me-nagpur
/pages/marketing-school-in-nagpur
/pages/online-digital-marketing-course-nagpur
/pages/seo-course-in-nagpur
/pages/social-media-marketing-course-nagpur
/pages/google-ads-course-nagpur

### GitHub Actions (auto-runs daily)
- Pings Google + Bing with sitemap every day at 6 AM IST
- Crawls all 17 landing pages as Googlebot
- Regenerates sitemap.xml with all blog posts weekly
- Auto-commits updated sitemap

### SEO (100/100 target)
- Unique meta title + description on every page
- Open Graph + Twitter Card on every page
- Canonical tags on every page
- JSON-LD structured data (EducationalOrganization + BlogPosting)
- Full sitemap.xml (17 landing pages + blog posts)
- robots.txt blocking admin pages
- No meta keywords (removed — they hurt SEO)
- Footer: real URLs instead of hashtags
- Admin pages: noindex/nofollow
