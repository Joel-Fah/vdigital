'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { HERO, LOGO_SRC } from '@/content/static-copy';
import { Icon } from '@/components/ui/icon';

/**
 * Hero (v1.0 redesign) — a polaroid-framed portrait centre stage with the name
 * and roles clearly upfront, the badges flanking it, and CTAs + description
 * below. Behind everything sit soft teal gradient blobs that drift gently toward
 * the cursor (parallax) over a faint dot grid. All motion respects
 * prefers-reduced-motion.
 *
 * PEXELS-PLACEHOLDER: the polaroid uses the VDIGITAL logo as a stand-in for a
 * real portrait of Vitus — swap `LOGO_SRC` for a headshot when available.
 */
export function Hero() {
  const layerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // -1..1 relative to viewport centre.
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        if (layerRef.current) {
          layerRef.current.style.transform = `translate3d(${x * 24}px, ${y * 24}px, 0)`;
        }
        if (frameRef.current) {
          // The photo counter-parallaxes very slightly for depth + a soft tilt.
          frameRef.current.style.transform = `translate3d(${x * -8}px, ${y * -8}px, 0) rotate(-2deg)`;
        }
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <section
        id="hero"
        className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-6 py-16 md:px-12 lg:px-20"
      >
        {/* Interactive background: drifting teal blobs + dot grid */}
        <div
          ref={layerRef}
          className="pointer-events-none absolute inset-0 -z-10 will-change-transform"
          aria-hidden
        >
          <div
            className="absolute left-[8%] top-[12%] h-[420px] w-[420px] rounded-full blur-2xl"
            style={{
              background: 'radial-gradient(circle, rgba(59,191,191,0.28), transparent 70%)',
            }}
          />
          <div
            className="absolute right-[6%] top-[30%] h-[360px] w-[360px] rounded-full blur-2xl"
            style={{
              background: 'radial-gradient(circle, rgba(201,168,76,0.18), transparent 70%)',
            }}
          />
          <div
            className="absolute bottom-[6%] left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-full blur-2xl"
            style={{
              background: 'radial-gradient(circle, rgba(27,122,122,0.20), transparent 70%)',
            }}
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.5]"
          aria-hidden
          style={{
            backgroundImage: 'radial-gradient(rgba(27,122,122,0.14) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, #000 40%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 70% 60% at 50% 45%, #000 40%, transparent 100%)',
          }}
        />

        {/* Eyebrow */}
        <div className="mb-6 inline-flex items-center gap-2 rounded border border-teal/20 bg-teal-ultra/80 px-4 py-1.5 text-[0.7rem] uppercase tracking-[2px] text-teal backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-bright" aria-hidden />
          {HERO.tag}
        </div>

        {/* Name + roles */}
        <h1 className="text-center font-display text-hero-name font-bold leading-[1.05] text-ink">
          {HERO.firstName} <em className="not-italic text-teal">{HERO.lastName}</em>
        </h1>
        <p className="mt-3 text-center text-[0.9rem] tracking-[0.5px] text-ink-muted">
          {HERO.title}
        </p>

        {/* Photo flanked by badges */}
        <div className="my-9 flex items-center justify-center gap-6 md:gap-12">
          <div className="hidden flex-col items-end gap-4 md:flex">
            <Badge icon={HERO.badges[0].icon} text={HERO.badges[0].text} />
            <Badge icon={HERO.badges[1].icon} text={HERO.badges[1].text} />
          </div>

          {/* Polaroid */}
          <div
            ref={frameRef}
            className="relative shrink-0 rounded-[3px] bg-white p-3 pb-10 shadow-card will-change-transform"
            style={{ transform: 'rotate(-2deg)' }}
          >
            <div className="relative h-56 w-56 overflow-hidden bg-teal-ultra sm:h-64 sm:w-64">
              <Image
                src={LOGO_SRC}
                alt="Vitus Ahanda"
                fill
                sizes="256px"
                priority
                className="object-cover"
              />
            </div>
            <p className="absolute bottom-3 left-0 right-0 text-center font-display text-[0.95rem] font-bold text-ink">
              Vitus Ahanda
            </p>
          </div>

          <div className="hidden flex-col items-start gap-4 md:flex">
            <Badge icon={HERO.badges[2].icon} text={HERO.badges[2].text} />
            <div className="rounded-md border border-line bg-surface-white/90 px-4 py-3 text-center shadow-float backdrop-blur-sm">
              <div className="font-display text-[1.6rem] font-bold text-teal">1,6M</div>
              <div className="text-[0.6rem] uppercase tracking-wide text-ink-muted">
                Vues générées
              </div>
            </div>
          </div>
        </div>

        {/* Badges row on mobile (flank layout is desktop-only) */}
        <div className="mb-6 flex flex-wrap justify-center gap-3 md:hidden">
          {HERO.badges.map((b) => (
            <Badge key={b.text} icon={b.icon} text={b.text} />
          ))}
        </div>

        {/* Description + CTAs */}
        <p className="max-w-[520px] text-center text-[0.92rem] leading-[1.85] text-ink-mid">
          {HERO.description}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="#contact"
            className="inline-block rounded bg-teal px-7 py-[13px] text-[0.8rem] uppercase tracking-[1px] text-white transition-all duration-200 hover:-translate-y-px hover:bg-teal-dark"
          >
            {HERO.ctaPrimary}
          </a>
          <a
            href="#projects"
            className="inline-block rounded border-[1.5px] border-teal bg-surface-white/70 px-7 py-[13px] text-[0.8rem] uppercase tracking-[1px] text-teal backdrop-blur-sm transition-all duration-200 hover:bg-teal-ultra"
          >
            {HERO.ctaOutline}
          </a>
        </div>
      </section>

      {/* Stats bar */}
      <div className="grid grid-cols-2 border-y border-line bg-teal-ultra md:grid-cols-4">
        {HERO.stats.map((s, i) => (
          <div
            key={i}
            className="border-line px-6 py-[1.8rem] md:px-10 [&:not(:last-child)]:border-r"
          >
            <div className="font-display text-[2rem] font-bold text-teal">
              {s.value}
              {s.sup && <sup className="text-[1.1rem]">{s.sup}</sup>}
            </div>
            <div className="mt-[3px] text-[0.72rem] uppercase tracking-[1px] text-ink-muted">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Badge({ icon, text }: { icon: 'trophy' | 'bar-chart' | 'sparkle'; text: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-line bg-surface-white/90 px-3.5 py-2 text-[0.72rem] text-teal shadow-float backdrop-blur-sm">
      <Icon name={icon} className="h-3.5 w-3.5" />
      {text}
    </div>
  );
}
