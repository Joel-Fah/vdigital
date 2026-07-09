import { Section, SectionHeader } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { APPROACH_STEPS, SECTION_COPY } from '@/content/static-copy';

/**
 * "Mon Approche" — `.section.alt` + `.approach-steps`: four numbered steps
 * separated by 1px right borders. Static content (it describes the method, not
 * client data), but its Section row makes it orderable/hideable like the rest.
 */
export function ApproachSection() {
  const copy = SECTION_COPY.approach;
  return (
    <Section id="approach" alt>
      <SectionHeader eyebrow={copy.eyebrow} titleLead={copy.titleLead} titleEm={copy.titleEm} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        {APPROACH_STEPS.map((step, i) => (
          <Reveal
            key={step.num}
            delay={i * 0.06}
            className="border-line p-8 [&:not(:last-child)]:border-b sm:[&:not(:last-child)]:border-b-0 sm:[&:not(:last-child)]:border-r"
          >
            <div className="mb-[0.7rem] font-display text-[2.8rem] font-bold leading-none text-teal-light">
              {step.num}
            </div>
            <p className="mb-[0.4rem] text-[0.92rem] font-medium text-ink">{step.title}</p>
            <p className="text-[0.78rem] leading-[1.6] text-ink-muted">{step.text}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
