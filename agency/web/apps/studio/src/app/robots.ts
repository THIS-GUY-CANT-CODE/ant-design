import type { MetadataRoute } from 'next';

// Concepts and case studies name real businesses that are not clients, so they stay out of search.
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return { rules: { userAgent: '*', allow: '/', disallow: ['/concepts/', '/work/'] }, sitemap: `${base}/sitemap.xml` };
}
