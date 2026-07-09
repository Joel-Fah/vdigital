import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';

/**
 * Sitemap. Individual projects/services open in the drawer (query params, not
 * routes — Section 5.3), so the crawlable surface is the three main pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.SITE_URL.replace(/\/$/, '');
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ];
}
