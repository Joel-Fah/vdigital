import Image from 'next/image';
import { HERO, LOGO_SRC } from '@/content/static-copy';

/**
 * Hero — 1:1 rebuild of the original `.hero` + `.stats-bar`.
 * Circular logo frame with three floating badges; radial teal glow top-right;
 * gradient hairline along the bottom. Visual column hidden below 768px, as in
 * the original.
 */
export function Hero() {
  return (
    <>
      <section
        id="hero"
        className="relative grid min-h-[90vh] items-center gap-8 overflow-hidden px-6 py-12 md:grid-cols-[1.1fr_1fr] md:gap-16 md:px-20 md:py-20"
      >
        {/* .hero-bg-circle */}
        <div
          className="pointer-events-none absolute -right-[120px] -top-[120px] h-[700px] w-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, var(--teal-ultra) 0%, transparent 70%)' }}
          aria-hidden
        />
        {/* .hero-bg-line */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-[3px] w-full"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--teal-light), transparent)',
          }}
          aria-hidden
        />

        <div className="relative z-[2]">
          {/* .hero-tag */}
          <div className="mb-[1.8rem] inline-flex items-center gap-2 rounded border border-teal/20 bg-teal-ultra px-4 py-1.5 text-[0.7rem] uppercase tracking-[2px] text-teal">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-bright" aria-hidden />
            {HERO.tag}
          </div>

          {/* .hero-name */}
          <h1 className="mb-[0.4rem] font-display text-hero-name font-bold leading-[1.1] text-ink">
            {HERO.firstName}
            <br />
            <em className="not-italic text-teal">{HERO.lastName}</em>
          </h1>

          {/* .hero-title */}
          <p className="mb-6 border-b border-line pb-6 text-[0.95rem] tracking-[0.5px] text-ink-muted">
            {HERO.title}
          </p>

          {/* .hero-desc */}
          <p className="mb-10 max-w-[440px] text-[0.92rem] leading-[1.85] text-ink-mid">
            {HERO.description}
          </p>

          {/* .hero-btns */}
          <div className="flex flex-wrap gap-4">
            <a
              href="#contact"
              className="inline-block rounded bg-teal px-7 py-[13px] text-[0.8rem] uppercase tracking-[1px] text-white transition-all duration-200 hover:-translate-y-px hover:bg-teal-dark"
            >
              {HERO.ctaPrimary}
            </a>
            <a
              href="#projects"
              className="inline-block rounded border-[1.5px] border-teal px-7 py-[13px] text-[0.8rem] uppercase tracking-[1px] text-teal transition-all duration-200 hover:bg-teal-ultra"
            >
              {HERO.ctaOutline}
            </a>
          </div>
        </div>

        {/* .hero-visual — hidden on mobile, exactly as the original */}
        <div className="relative z-[2] hidden items-center justify-center md:flex">
          <div className="relative flex h-[320px] w-[320px] items-center justify-center rounded-full border-[1.5px] border-line bg-teal-ultra">
            <div className="flex h-[270px] w-[270px] items-center justify-center rounded-full bg-surface-white shadow-card">
              <Image
                src={LOGO_SRC}
                alt="VDIGITAL"
                width={190}
                height={190}
                className="h-[190px] w-[190px] rounded-full object-cover"
                priority
              />
            </div>
            <FloatingBadge className="right-[-10px] top-5">{HERO.badges[0]}</FloatingBadge>
            <FloatingBadge className="bottom-10 left-[-30px]">{HERO.badges[1]}</FloatingBadge>
            <FloatingBadge className="bottom-[100px] right-[-15px]">{HERO.badges[2]}</FloatingBadge>
          </div>
        </div>
      </section>

      {/* .stats-bar — left-aligned cells, divided by 1px teal borders */}
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

function FloatingBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`absolute whitespace-nowrap rounded-md border border-line bg-surface-white px-3.5 py-2 text-[0.72rem] text-teal shadow-float ${className}`}
    >
      {children}
    </div>
  );
}
