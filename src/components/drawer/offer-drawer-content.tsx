import Image from 'next/image';
import type { MediaAsset, Offer } from '@prisma/client';
import { Button } from '@/components/ui/button';

type OfferDetail = Offer & { image: MediaAsset | null };

export function OfferDrawerContent({ data }: { data: unknown }) {
  const offer = data as OfferDetail;
  const isDiag = offer.kind !== 'formation';
  const meta = (offer.duration ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6">
      {offer.image && (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md bg-teal-ultra">
          <Image
            src={offer.image.url}
            alt={offer.image.altText ?? offer.name}
            fill
            sizes="480px"
            className="object-cover"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {offer.icon && <span className="text-[1.4rem]">{offer.icon}</span>}
        <span className="rounded-sm border border-line bg-teal-ultra px-2 py-1 text-[0.62rem] uppercase tracking-[1px] text-teal">
          {isDiag ? 'Diagnostic' : 'Formation'}
        </span>
        {offer.badge && (
          <span className="rounded-sm border border-line px-2 py-1 text-[0.62rem] uppercase tracking-[1px] text-ink-muted">
            {offer.badge}
          </span>
        )}
      </div>

      {offer.priceNote && <p className="text-[0.9rem] font-medium text-teal">{offer.priceNote}</p>}

      <p className="whitespace-pre-line text-[0.88rem] leading-loose text-ink-mid">
        {offer.description}
      </p>

      {offer.deliverables.length > 0 && (
        <div>
          <p className="mb-2 text-[0.7rem] uppercase tracking-label text-ink-muted">
            {isDiag ? 'Inclus' : 'Modules'}
          </p>
          <ul className="flex flex-col gap-2">
            {offer.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-2 text-[0.85rem] text-ink-mid">
                <span className="mt-0.5 flex-shrink-0 font-bold text-teal">
                  {isDiag ? '✓' : '→'}
                </span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Diagnostics show a single duration pill; formations show meta tags. */}
      {isDiag
        ? offer.duration && (
            <span className="inline-flex items-center gap-[5px] rounded-sm border border-line bg-teal-ultra px-2.5 py-1 text-[0.68rem] uppercase tracking-[1px] text-teal">
              {offer.duration}
            </span>
          )
        : meta.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {meta.map((m) => (
                <span
                  key={m}
                  className="rounded-sm border border-line px-2 py-[3px] text-[0.62rem] uppercase tracking-[0.8px] text-ink-muted"
                >
                  {m}
                </span>
              ))}
            </div>
          )}

      <Button href="/#contact" variant="primary" size="sm">
        Demander cette offre
      </Button>
    </div>
  );
}
