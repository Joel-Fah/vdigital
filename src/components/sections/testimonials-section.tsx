import Link from 'next/link';
import type { MediaAsset, Testimonial } from '@prisma/client';
import { Section, SectionHeader } from '@/components/ui/section';
import { Reveal } from '@/components/ui/reveal';
import { TestimonialCard } from '@/components/cards/testimonial-card';
import { SECTION_COPY } from '@/content/static-copy';

type TestimonialWithPhoto = Testimonial & { photo: MediaAsset | null };

/**
 * Testimonials — masonry (CSS columns, ≤3) so uneven card heights pack neatly.
 * Shows up to 6 on the homepage; when more exist, a "Voir tous les témoignages"
 * button opens the side-panel drawer (?temoignages=1). Auto-hides when empty
 * (Section 6). `total` is the full visible count.
 */
export function TestimonialsSection({
  testimonials,
  total,
}: {
  testimonials: TestimonialWithPhoto[];
  total: number;
}) {
  if (testimonials.length === 0) return null;

  const copy = SECTION_COPY.testimonials;
  return (
    <Section id="testimonials" alt>
      <SectionHeader eyebrow={copy.eyebrow} titleLead={copy.titleLead} titleEm={copy.titleEm} />

      {/* Masonry via CSS columns — cards avoid breaking across columns. */}
      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.id} delay={i * 0.05} className="mb-6 break-inside-avoid">
            <TestimonialCard testimonial={t} />
          </Reveal>
        ))}
      </div>

      {total > testimonials.length && (
        <div className="mt-10 flex justify-center">
          <Link
            href="?temoignages=1"
            scroll={false}
            className="inline-block rounded border-[1.5px] border-teal px-7 py-[13px] text-[0.8rem] uppercase tracking-[1px] text-teal transition-all duration-200 hover:bg-teal-ultra"
          >
            Voir tous les témoignages ({total})
          </Link>
        </div>
      )}
    </Section>
  );
}
