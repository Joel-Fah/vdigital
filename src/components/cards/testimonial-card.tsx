import Image from 'next/image';
import { Quote } from 'lucide-react';
import type { MediaAsset, Testimonial } from '@prisma/client';
import { initials } from '@/lib/utils';

type TestimonialWithPhoto = Testimonial & { photo: MediaAsset | null };

export function TestimonialCard({ testimonial }: { testimonial: TestimonialWithPhoto }) {
  return (
    <figure className="flex flex-col rounded-lg border border-line bg-surface-white p-6">
      <Quote className="mb-3 h-6 w-6 flex-shrink-0 text-teal/30" />
      <blockquote className="text-[0.9rem] italic leading-relaxed text-ink-mid">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-3 border-t border-line-soft pt-4">
        {/* Fixed 40px avatar (never stretched by a two-line role). */}
        {testimonial.photo ? (
          <Image
            src={testimonial.photo.url}
            alt={testimonial.photo.altText ?? testimonial.author}
            width={40}
            height={40}
            style={{ width: 40, height: 40 }}
            className="flex-shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden
            style={{ width: 40, height: 40 }}
            className="flex flex-shrink-0 items-center justify-center rounded-full bg-teal-light text-center font-display text-[0.8rem] font-bold leading-none text-teal"
          >
            {initials(testimonial.author)}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-[0.85rem] font-medium text-ink">{testimonial.author}</p>
          {(testimonial.role || testimonial.company) && (
            <p className="text-[0.72rem] leading-snug text-ink-muted">
              {[testimonial.role, testimonial.company].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
