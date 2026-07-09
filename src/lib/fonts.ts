import { Playfair_Display, DM_Sans } from 'next/font/google';

/**
 * Fonts self-hosted by Next.js (Section 2.2) — no external Google Fonts <link>,
 * better performance and no render-blocking request than the original static HTML.
 */
export const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

export const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const fontVariables = `${playfair.variable} ${dmSans.variable}`;
