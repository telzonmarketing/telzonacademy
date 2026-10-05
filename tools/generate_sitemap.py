#!/usr/bin/env python3
"""Fetch published blogs from Supabase and regenerate public/sitemap.xml.

Run by .github/workflows/generate-sitemap.yml. Kept as a standalone file (not
inlined in the workflow YAML) so the HTML/Python indentation can never break the
workflow's block-scalar parsing.
"""

import datetime
import os

import requests

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://lcnfnwivodzjjpykihfn.supabase.co")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")

LANDING_PAGES = [
    ("digital-marketing-course-in-nagpur", "1.0", "weekly"),
    ("digital-marketing-institute-in-nagpur", "1.0", "weekly"),
    ("best-digital-marketing-course-in-nagpur", "1.0", "weekly"),
    ("digital-marketing-institute-nagpur", "0.95", "weekly"),
    ("digital-marketing-course-with-placement-nagpur", "0.95", "weekly"),
    ("digital-marketing-course-fees-in-nagpur", "0.9", "monthly"),
    ("digital-marketing-course-fees-and-duration-nagpur", "0.9", "monthly"),
    ("digital-marketing-classes-in-nagpur", "0.9", "monthly"),
    ("best-digital-marketing-classes-in-nagpur", "0.9", "monthly"),
    ("digital-marketing-course-for-beginners-nagpur", "0.85", "monthly"),
    ("digital-marketing-course-for-working-professionals-nagpur", "0.85", "monthly"),
    ("digital-marketing-training-institute-nagpur", "0.85", "monthly"),
    ("digital-marketing-training-in-nagpur", "0.85", "monthly"),
    ("digital-marketing-academy-in-nagpur", "0.85", "monthly"),
    ("digital-marketing-course-near-me-nagpur", "0.85", "monthly"),
    ("digital-marketing-course-near-me", "0.85", "monthly"),
    ("digital-marketing-course-duration-nagpur", "0.8", "monthly"),
    ("marketing-school-in-nagpur", "0.8", "monthly"),
    ("online-digital-marketing-course-nagpur", "0.9", "monthly"),
    ("seo-course-in-nagpur", "0.85", "monthly"),
    ("google-ads-course-nagpur", "0.85", "monthly"),
    ("social-media-marketing-course-nagpur", "0.85", "monthly"),
    ("performance-marketing-course-nagpur", "0.8", "monthly"),
    ("content-marketing-course-nagpur", "0.8", "monthly"),
    ("digital-marketing-internship-in-nagpur", "0.8", "monthly"),
]

BASE = "https://telzonacademy.in"


def url_entry(loc, lastmod, changefreq, priority):
    return (
        "  <url>\n"
        f"    <loc>{loc}</loc>\n"
        f"    <lastmod>{lastmod}</lastmod>\n"
        f"    <changefreq>{changefreq}</changefreq>\n"
        f"    <priority>{priority}</priority>\n"
        "  </url>"
    )


def fetch_blogs():
    if not SUPABASE_ANON_KEY:
        print("WARNING: SUPABASE_ANON_KEY not set — generating sitemap without blog posts")
        return []
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
    }
    try:
        r = requests.get(
            f"{SUPABASE_URL}/rest/v1/blogs?is_published=eq.true&select=slug,updated_at",
            headers=headers,
            timeout=30,
        )
        if not r.ok:
            print(f"WARNING: Supabase returned {r.status_code} — {r.text[:200]}")
            return []
        return r.json()
    except requests.RequestException as exc:
        print(f"WARNING: Supabase request failed ({exc}) — continuing without blogs")
        return []


def main():
    today = datetime.date.today().isoformat()
    blogs = fetch_blogs()
    print(f"Found {len(blogs)} published blog posts")

    urls = [
        url_entry(f"{BASE}/", today, "weekly", "1.0"),
        url_entry(f"{BASE}/blog", today, "daily", "0.9"),
        url_entry(f"{BASE}/lead-generation-package", today, "weekly", "0.95"),
    ]

    for slug, priority, changefreq in LANDING_PAGES:
        urls.append(url_entry(f"{BASE}/pages/{slug}", today, changefreq, priority))

    for blog in blogs:
        slug = blog.get("slug", "")
        lastmod = (blog.get("updated_at") or today)[:10]
        if slug:
            urls.append(url_entry(f"{BASE}/blog/{slug}", lastmod, "weekly", "0.7"))

    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n'
    xml += "\n\n".join(urls)
    xml += "\n\n</urlset>\n"

    os.makedirs("public", exist_ok=True)
    with open("public/sitemap.xml", "w") as f:
        f.write(xml)

    print(f"Generated sitemap with {len(urls)} URLs")


if __name__ == "__main__":
    main()
