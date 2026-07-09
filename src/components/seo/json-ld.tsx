import type { SiteSettings } from '@prisma/client';
import { env } from '@/lib/env';
import { HERO } from '@/content/static-copy';

/**
 * schema.org structured data (Phase 8). ProfilePage + Person so search engines
 * understand who the site is about. `sameAs` is populated from the social links
 * managed in Site Settings.
 */
export function PersonJsonLd({ settings }: { settings: SiteSettings | null }) {
  const social = (settings?.socialLinks as Record<string, string> | null) ?? {};
  const sameAs = Object.values(social).filter(Boolean);

  const data = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: `${HERO.firstName} ${HERO.lastName}`,
      jobTitle: HERO.title,
      description: settings?.seoDescription ?? HERO.description,
      url: env.SITE_URL,
      email: settings?.contactEmail ?? undefined,
      telephone: settings?.contactPhone ?? undefined,
      address: { '@type': 'PostalAddress', addressLocality: 'Yaoundé', addressCountry: 'CM' },
      ...(sameAs.length ? { sameAs } : {}),
    },
  };

  return (
    <script
      type="application/ld+json"
      // Content is our own static/settings data, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
