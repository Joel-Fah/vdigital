import Image from 'next/image';
import type { SiteSettings } from '@prisma/client';
import { FOOTER, LOGO_SRC } from '@/content/static-copy';

/**
 * Footer — 1:1 rebuild of the original `<footer>`: logo + wordmark, tagline,
 * copyright. Stacks and centres below 768px, as in the original.
 * Social links render only when set in Site Settings (dynamic addition).
 */
export function Footer({ settings }: { settings: SiteSettings | null }) {
  const social = (settings?.socialLinks as Record<string, string> | null) ?? {};
  const links = Object.entries(social).filter(([, href]) => Boolean(href));

  return (
    <footer className="border-t border-line bg-surface-white">
      <div className="flex flex-col items-center gap-2 px-6 py-6 text-center md:flex-row md:justify-between md:px-12 md:text-left lg:px-20">
        {/* .footer-brand */}
        <div className="flex items-center gap-2">
          <Image
            src={LOGO_SRC}
            alt="VDIGITAL"
            width={26}
            height={26}
            className="h-[26px] w-[26px] rounded-full object-cover"
          />
          <span className="font-display text-[0.95rem] text-ink">
            V<span className="text-teal">DIGITAL</span>
          </span>
        </div>

        <p className="text-[0.78rem] text-ink-muted">{FOOTER.tagline}</p>

        <div className="flex flex-col items-center gap-1 md:items-end">
          {links.length > 0 && (
            <div className="flex items-center gap-3">
              {links.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.72rem] capitalize text-ink-muted transition-colors hover:text-teal"
                >
                  {label}
                </a>
              ))}
            </div>
          )}
          <p className="text-[0.72rem] text-ink-light">{FOOTER.copyright}</p>
        </div>
      </div>

      {/* Built-by credit */}
      <div className="flex items-center justify-center gap-2 border-t border-line-soft px-6 py-4">
        <span className="text-[0.72rem] text-ink-muted">Conçu et développé par</span>
        <a
          href="https://hinkaku.tech"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Hinkaku Ltd."
          className="opacity-80 transition-opacity hover:opacity-100"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hinkaku-horizontal.svg" alt="Hinkaku Ltd." className="h-5 w-auto" />
        </a>
      </div>
    </footer>
  );
}
