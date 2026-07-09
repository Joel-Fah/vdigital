import type { Metadata, Viewport } from 'next';
import { fontVariables } from '@/lib/fonts';
import { getSiteSettings } from '@/lib/content';
import { env } from '@/lib/env';
import '@/styles/globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings?.seoTitle ?? 'VDIGITAL — Vitus Ahanda';
  const description =
    settings?.seoDescription ??
    'Expert en Communication Digitale · Community Management · Social Media Strategy · Branding.';

  return {
    metadataBase: new URL(env.SITE_URL),
    title: {
      default: title,
      template: '%s · VDIGITAL',
    },
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'fr_FR',
      siteName: 'VDIGITAL',
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true },
    icons: { icon: '/favicon.ico' },
  };
}

export const viewport: Viewport = {
  themeColor: '#1B7A7A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
