'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LOGO_SRC, NAV_LINKS } from '@/content/static-copy';
import type { SectionMap } from '@/lib/content';

/**
 * Sticky frosted nav — a 1:1 rebuild of the original `<nav>`: logo + wordmark,
 * six uppercase anchors, and the "Me contacter" CTA. No extra links.
 * (/projects and /services are reached via the teaser "Voir tous…" CTAs.)
 *
 * Dynamic behaviour retained: IntersectionObserver scrollspy on `/`, links
 * filtered by Section.visible, and a mobile hamburger menu.
 */
export function Nav({ sections }: { sections: SectionMap }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [active, setActive] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = NAV_LINKS.filter((l) => sections[l.key]?.visible !== false);

  useEffect(() => {
    if (!isHome) return;
    const targets = links
      .map((l) => document.getElementById(l.key))
      .filter((el): el is HTMLElement => el !== null);
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHome, pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const href = (key: string) => (isHome ? `#${key}` : `/#${key}`);

  return (
    <header className="nav-frost sticky top-0 z-[100] border-b border-line">
      <nav className="flex items-center justify-between px-6 py-4 md:px-20">
        {/* .nav-logo */}
        <Link href="/" className="flex items-center gap-2.5" aria-label="VDIGITAL — accueil">
          <Image
            src={LOGO_SRC}
            alt="VDIGITAL"
            width={34}
            height={34}
            className="h-[34px] w-[34px] rounded-full object-cover"
            priority
          />
          <span className="font-display text-[1.25rem] font-bold tracking-[1px] text-ink">
            V<span className="text-teal">DIGITAL</span>
          </span>
        </Link>

        {/* .nav-links */}
        <div className="hidden gap-10 md:flex">
          {links.map((l) => (
            <a
              key={l.key}
              href={href(l.key)}
              className={cn(
                'text-[0.78rem] uppercase tracking-[1.2px] transition-colors duration-200 hover:text-teal',
                isHome && active === l.key ? 'text-teal' : 'text-ink-muted',
              )}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* .nav-cta */}
          <a
            href={href('contact')}
            className="hidden rounded bg-teal px-[22px] py-[9px] text-[0.75rem] uppercase tracking-[1px] text-white transition-colors duration-200 hover:bg-teal-dark sm:inline-block"
          >
            Me contacter
          </a>
          <button
            className="rounded p-1.5 text-ink transition-colors hover:text-teal md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="nav-frost overflow-hidden border-t border-line md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="flex flex-col px-6 py-4">
              {links.map((l) => (
                <a
                  key={l.key}
                  href={href(l.key)}
                  onClick={() => setMobileOpen(false)}
                  className="py-2 text-[0.85rem] uppercase tracking-[1.2px] text-ink-muted hover:text-teal"
                >
                  {l.label}
                </a>
              ))}
              <a
                href={href('contact')}
                onClick={() => setMobileOpen(false)}
                className="mt-3 rounded bg-teal px-[22px] py-[9px] text-center text-[0.75rem] uppercase tracking-[1px] text-white"
              >
                Me contacter
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
