import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import type { MediaAsset, Service } from '@prisma/client';
import { TagPill } from '@/components/ui/tag-pill';
import { stripHtml } from '@/lib/utils';

type ServiceWithIcon = Service & { icon: MediaAsset | null };

/**
 * ServiceCard — original `.service-card`. Opens the shared drawer via
 * `?service=<slug>` (Section 5.3). Uses a lucide icon fallback when no custom
 * icon MediaAsset is set.
 */
export function ServiceCard({ service }: { service: ServiceWithIcon }) {
  return (
    <Link
      href={`?service=${service.slug}`}
      scroll={false}
      className="group block bg-surface-white p-10 transition-colors duration-200 hover:bg-teal-ultra focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal"
      aria-label={`Voir le service : ${service.title}`}
    >
      <div className="mb-4 flex h-[46px] w-[46px] items-center justify-center rounded-md border border-teal/20 bg-teal-ultra">
        {service.icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={service.icon.url} alt="" className="h-5 w-5" />
        ) : (
          <Sparkles className="h-5 w-5 text-teal" strokeWidth={1.5} />
        )}
      </div>
      <h3 className="mb-2 text-[1rem] font-medium text-ink">{service.title}</h3>
      <p className="line-clamp-3 text-[0.83rem] leading-relaxed text-ink-muted">
        {stripHtml(service.description)}
      </p>
      {service.tags.length > 0 && (
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {service.tags.map((t) => (
            <TagPill key={t}>{t}</TagPill>
          ))}
        </div>
      )}
    </Link>
  );
}
