import Image from 'next/image';
import { Reveal } from '@/components/ui/reveal';
import { ABOUT, AWARD_MEDAL_SRC } from '@/content/static-copy';

/**
 * About — 1:1 rebuild of `.about-section`: avatar + mini-stats sidebar (hidden
 * on mobile, as in the original), bio prose with the teal-accented highlight,
 * the Canal+ award card, and the professional timeline.
 */
export function About() {
  return (
    <section id="about" className="bg-surface-white px-6 py-12 md:px-20 md:py-24">
      <div className="grid items-start gap-16 md:grid-cols-[1fr_1.6fr]">
        {/* .about-left — display:none on mobile in the original */}
        <div className="hidden md:block">
          <div className="mb-8 flex flex-col items-center gap-5">
            <div className="relative flex h-[150px] w-[150px] items-center justify-center rounded-full border-2 border-teal/20 bg-gradient-to-br from-teal-light to-teal-ultra font-display text-[2.8rem] font-bold text-teal">
              {ABOUT.initials}
              {/* .award-pin2 */}
              <span className="absolute bottom-1 right-1 flex h-[38px] w-[38px] items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-gold to-gold-soft text-base">
                🏆
              </span>
            </div>
            <div>
              <p className="text-center font-display text-[1.1rem] font-bold text-ink">
                {ABOUT.name}
              </p>
              <p className="mt-[3px] text-center text-[0.75rem] uppercase tracking-[1.2px] text-teal">
                {ABOUT.role}
              </p>
              <p className="mt-[3px] text-center text-[0.75rem] text-ink-muted">{ABOUT.location}</p>
            </div>
          </div>

          {/* .mini-stats */}
          <div className="grid grid-cols-2 overflow-hidden rounded-md border border-line">
            {ABOUT.miniStats.map((s, i) => (
              <div
                key={i}
                className={`p-4 text-center ${i % 2 === 0 ? 'border-r border-line' : ''} ${i < 2 ? 'border-b border-line' : ''}`}
              >
                <div className="font-display text-[1.4rem] font-bold text-teal">{s.value}</div>
                <div className="mt-[2px] text-[0.62rem] uppercase tracking-[0.8px] text-ink-muted">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* .about-right */}
        <div>
          <p className="mb-[0.6rem] text-[0.7rem] uppercase tracking-eyebrow text-teal">
            {ABOUT.eyebrow}
          </p>
          <h2 className="mb-6 font-display text-sec-title font-bold leading-[1.2] text-ink">
            {ABOUT.titleLead}
            <br />
            {ABOUT.titleRest}
            <em className="italic text-teal">{ABOUT.titleEm}</em>
          </h2>

          <Reveal>
            <p className="mb-4 text-[0.88rem] leading-[1.85] text-ink-mid">{ABOUT.bio1}</p>

            {/* .bio-hl */}
            <div className="mb-6 rounded-r-md border-l-2 border-teal bg-teal-ultra py-4 pl-[1.2rem] pr-4 text-[0.88rem] leading-[1.85] text-ink-mid">
              {ABOUT.highlightPre}
              <strong className="font-medium">{ABOUT.highlightStrong}</strong>
              {ABOUT.highlightPost}
            </div>

            <p className="text-[0.88rem] leading-[1.85] text-ink-mid">{ABOUT.bio2}</p>
          </Reveal>

          {/* .award-card */}
          <Reveal
            className="relative my-8 flex flex-col items-start gap-[1.8rem] overflow-hidden rounded-lg border-[1.5px] border-gold/30 p-8 sm:flex-row sm:items-center"
            style={{
              background: 'linear-gradient(135deg, rgba(201,168,76,0.06), rgba(201,168,76,0.02))',
            }}
          >
            <span
              className="absolute left-0 right-0 top-0 h-[2px]"
              style={{
                background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
              }}
              aria-hidden
            />
            {/* .award-medal — real image, as in the original */}
            <div className="h-[68px] w-[68px] flex-shrink-0 overflow-hidden rounded-full">
              <Image
                src={AWARD_MEDAL_SRC}
                alt="Canal+ Creative Talent"
                width={68}
                height={68}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="mb-1 text-[0.62rem] uppercase tracking-[2px] text-gold">
                {ABOUT.award.tag}
              </p>
              <p className="mb-[3px] font-display text-[1.1rem] font-bold text-ink">
                {ABOUT.award.name}
              </p>
              <p className="mb-1.5 text-[0.78rem] text-ink-muted">{ABOUT.award.org}</p>
              <p className="text-[0.78rem] leading-[1.6] text-ink-mid">{ABOUT.award.desc}</p>
            </div>
            {/* .award-pill */}
            <span className="self-start whitespace-nowrap rounded border border-gold/30 bg-gold/10 px-3 py-1 text-[0.62rem] uppercase tracking-[1px] text-gold">
              {ABOUT.award.pill}
            </span>
          </Reveal>

          {/* .timeline */}
          <div className="mt-8">
            <p className="mb-[1.2rem] text-[0.7rem] uppercase tracking-[2px] text-ink-muted">
              {ABOUT.timelineLabel}
            </p>
            <div className="relative pl-6">
              <span className="absolute bottom-1.5 left-[5px] top-1.5 w-px bg-line" aria-hidden />
              {ABOUT.timeline.map((t, i) => (
                <div key={i} className="relative pb-[1.4rem] last:pb-0">
                  <span
                    className={`absolute -left-6 top-1 h-3 w-3 rounded-full border-2 border-white ${
                      t.gold ? 'bg-gold' : 'bg-teal-bright'
                    }`}
                    aria-hidden
                  />
                  <p className="mb-[2px] text-[0.65rem] uppercase tracking-[1px] text-teal">
                    {t.period}
                  </p>
                  <p className="mb-[2px] text-[0.88rem] font-medium text-ink">{t.role}</p>
                  <p className="text-[0.75rem] text-ink-muted">{t.org}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
