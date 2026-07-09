import type { MediaAsset, Testimonial } from '@prisma/client';
import { Section, SectionHeader } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { TestimonialCard } from '@/components/cards/testimonial-card';
import { SECTION_COPY } from '@/content/static-copy';

type TestimonialWithPhoto = Testimonial & { photo: MediaAsset | null };

/**
 * Testimonials — not present in the original HTML; added per spec §3.1 as a
 * dynamic section using the same visual language. Per §6, the ENTIRE section
 * auto-hides when empty (an empty social-proof block undermines trust more than
 * omitting it).
 */
export function TestimonialsSection({ testimonials }: { testimonials: TestimonialWithPhoto[] }) {
  if (testimonials.length === 0) return null;

  const copy = SECTION_COPY.testimonials;
  return (
    <Section id="testimonials" alt>
      <SectionHeader eyebrow={copy.eyebrow} titleLead={copy.titleLead} titleEm={copy.titleEm} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.id} delay={i * 0.05}>
            <TestimonialCard testimonial={t} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
