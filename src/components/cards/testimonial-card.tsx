import Image from 'next/image';
import { Quote } from 'lucide-react';
import type { MediaAsset, Testimonial } from '@prisma/client';

type TestimonialWithPhoto = Testimonial & { photo: MediaAsset | null };

export function TestimonialCard({ testimonial }: { testimonial: TestimonialWithPhoto }) {
  return (
    <figure className="flex h-full flex-col rounded-lg border border-line bg-surface-white p-6">
      <Quote className="mb-3 h-6 w-6 text-teal/30" />
      <blockquote className="flex-1 text-[0.9rem] italic leading-relaxed text-ink-mid">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-3 border-t border-line-soft pt-4">
        {testimonial.photo ? (
          <Image
            src={testimonial.photo.url}
            alt={testimonial.photo.altText ?? testimonial.author}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-light font-display text-sm font-bold text-teal">
            {testimonial.author.charAt(0)}
          </span>
        )}
        <div>
          <p className="text-[0.85rem] font-medium text-ink">{testimonial.author}</p>
          {(testimonial.role || testimonial.company) && (
            <p className="text-[0.72rem] text-ink-muted">
              {[testimonial.role, testimonial.company].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
