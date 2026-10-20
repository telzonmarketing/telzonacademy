// app/sitemap.ts — Next.js App Router dynamic sitemap
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Replace with your actual data source (database, CMS, API)
  // const pages = await db.query('SELECT slug, updated_at FROM pages')

  const staticPages = [
    { url: 'https://telzonacademy.in/', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: 'https://telzonacademy.in//about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://telzonacademy.in//contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  // Uncomment and adapt for dynamic pages:
  // const dynamicPages = pages.map(page => ({
  //   url: `https://telzonacademy.in//${page.slug}`,
  //   lastModified: page.updated_at,
  //   changeFrequency: 'weekly',
  //   priority: 0.8,
  // }))

  return [
    ...staticPages,
    // ...dynamicPages,
  ]
}
