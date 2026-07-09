import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Keep the obscured admin path and API out of the index (Section 8.2).
        disallow: [`/${env.ADMIN_BASE_PATH}`, '/api/'],
      },
    ],
    sitemap: `${env.SITE_URL}/sitemap.xml`,
  };
}
