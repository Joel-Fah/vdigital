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
 * Sticky frosted nav — 1:1 rebuild of the original `<nav>`: logo + wordmark,
 * six uppercase anchors, "Me contacter" CTA.
 *
 * Dynamic: IntersectionObserver scrollspy on `/`, links filtered by
 * Section.visible, and a full-screen mobile drawer whose tabs reveal top→bottom
 * and which locks page scroll while open.
 */
export function Nav({ sections }: { sections: SectionMap }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [active, setActive] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = NAV_LINKS.filter((l) => sections[l.key]?.visible !== false);

  // Scrollspy on the homepage.
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

  // Lock page scroll + close on Escape while the drawer is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

  const href = (key: string) => (isHome ? `#${key}` : `/#${key}`);

  return (
    <header className="nav-frost sticky top-0 z-[100] border-b border-line">
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-20">
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

        <div className="hidden gap-8 lg:flex xl:gap-10">
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
          <a
            href={href('contact')}
            className="hidden rounded bg-teal px-[22px] py-[9px] text-[0.75rem] uppercase tracking-[1px] text-white transition-colors duration-200 hover:bg-teal-dark sm:inline-block"
          >
            Me contacter
          </a>
          <button
            className="relative z-[130] rounded p-1.5 text-ink transition-colors hover:text-teal lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Full-screen mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[120] flex flex-col bg-surface-white lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <span className="font-display text-[1.25rem] font-bold tracking-[1px] text-ink">
                V<span className="text-teal">DIGITAL</span>
              </span>
            </div>

            <motion.ul
              className="flex flex-1 flex-col justify-center gap-1 px-8"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
            >
              {links.map((l) => (
                <motion.li
                  key={l.key}
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <a
                    href={href(l.key)}
                    onClick={() => setMobileOpen(false)}
                    className="block border-b border-line-soft py-4 font-display text-[1.6rem] font-bold text-ink transition-colors hover:text-teal"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
                className="mt-6"
              >
                <a
                  href={href('contact')}
                  onClick={() => setMobileOpen(false)}
                  className="inline-block rounded bg-teal px-7 py-3 text-[0.8rem] uppercase tracking-[1px] text-white"
                >
                  Me contacter
                </a>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
