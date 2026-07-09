import type { ExpertiseItem } from '@prisma/client';
import { Section, SectionHeader } from '@/components/ui/section';
import { SkillBar } from '@/components/ui/skill-bar';
import { SECTION_COPY, PLATFORMS, PLATFORMS_LABEL, TOOLS } from '@/content/static-copy';

/**
 * "Mon Expertise" — original `.expertise-grid` (two columns):
 *   left  = `.skills-list`   → DB-driven skill bars (empty state when empty)
 *   right = `.platforms` + `.tools-box` → static, rebuilt verbatim
 */
export function ExpertiseSection({ items }: { items: ExpertiseItem[] }) {
  const copy = SECTION_COPY.expertise;
  return (
    <Section id="expertise">
      <SectionHeader eyebrow={copy.eyebrow} titleLead={copy.titleLead} titleEm={copy.titleEm} />

      <div className="grid gap-12 md:grid-cols-2">
        {/* Left: skills (dynamic) */}
        <div>
          {items.length === 0 ? (
            <div>
              <div className="mb-[5px] flex justify-between">
                <span className="text-[0.85rem] text-ink-muted">
                  Expertise areas are being added.
                </span>
                <span className="text-[0.72rem] text-ink-light">0%</span>
              </div>
              {/* Muted skeleton skill-bar at 0% width */}
              <div className="h-[3px] rounded-sm bg-teal-light opacity-60" />
            </div>
          ) : (
            <div className="flex flex-col gap-[1.1rem]">
              {items.map((item) => (
                <div key={item.id}>
                  <SkillBar name={item.name} level={item.level} />
                  {item.description && (
                    <p className="mt-1 text-[0.72rem] text-ink-muted">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: platforms + tools (static) */}
        <div>
          <p className="mb-4 text-[0.68rem] uppercase tracking-[2px] text-ink-muted">
            {PLATFORMS_LABEL}
          </p>
          <div className="grid grid-cols-2 gap-[0.8rem] sm:grid-cols-3">
            {PLATFORMS.map((p) => (
              <div
                key={p.name}
                className="rounded-md border border-line bg-surface-white p-[0.9rem] text-center transition-all duration-200 hover:border-teal hover:bg-teal-ultra"
              >
                <div className="text-[0.8rem] font-medium text-ink">{p.name}</div>
                <div className="mt-[2px] text-[0.65rem] text-ink-muted">{p.sub}</div>
              </div>
            ))}
          </div>

          {/* .tools-box */}
          <div className="mt-[1.2rem] rounded-md border border-line bg-teal-ultra p-[1.1rem]">
            <p className="mb-[5px] text-[0.65rem] uppercase tracking-[1px] text-teal">
              {TOOLS.label}
            </p>
            <p className="text-[0.8rem] leading-[1.7] text-ink-muted">{TOOLS.text}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
