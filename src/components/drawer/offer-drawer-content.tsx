import Image from 'next/image';
import type { MediaAsset, Offer } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { RichText } from '@/components/ui/rich-text';
import { formatDuration, formatPrice } from '@/lib/offers';

type OfferDetail = Offer & { image: MediaAsset | null };

export function OfferDrawerContent({ data }: { data: unknown }) {
  const offer = data as OfferDetail;
  const isDiag = offer.kind !== 'formation';
  const duration = formatDuration(offer.durationValue, offer.durationUnit);
  const price = formatPrice(offer.priceAmount, offer.priceCurrency);

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
        <span className="rounded-sm border border-line bg-teal-ultra px-2 py-1 text-[0.62rem] uppercase tracking-[1px] text-teal">
          {isDiag ? 'Diagnostic' : 'Formation'}
        </span>
        {offer.badge && (
          <span className="rounded-sm border border-line px-2 py-1 text-[0.62rem] uppercase tracking-[1px] text-ink-muted">
            {offer.badge}
          </span>
        )}
      </div>

      {(duration || price) && (
        <div className="flex flex-wrap items-center gap-3">
          {duration && (
            <span className="inline-flex items-center rounded-sm border border-line bg-teal-ultra px-2.5 py-1 text-[0.68rem] uppercase tracking-[1px] text-teal">
              {duration}
            </span>
          )}
          {price && <span className="text-[1rem] font-medium text-teal">{price}</span>}
        </div>
      )}

      <RichText html={offer.description} />

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

      <Button href="/#contact" variant="primary" size="sm">
        Demander cette offre
      </Button>
    </div>
  );
}
