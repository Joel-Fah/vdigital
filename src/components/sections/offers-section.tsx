'use client';

import Link from 'next/link';
import * as Tabs from '@radix-ui/react-tabs';
import type { MediaAsset, Offer } from '@prisma/client';
import { Package } from 'lucide-react';
import { Section, SectionHeader } from '@/components/ui/section';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { stripHtml } from '@/lib/utils';
import { formatDuration, formatPrice } from '@/lib/offers';
import {
  SECTION_COPY,
  OFFERS_TABS,
  OFFERS_AUDIENCE,
  OFFERS_CTA_BUTTONS,
  CONTACT_DIRECT,
} from '@/content/static-copy';

type OfferWithImage = Offer & { image: MediaAsset | null };
type Kind = 'diagnostic' | 'formation';

/**
 * "Diagnostics & Formations" — 1:1 rebuild of the original tabbed `#offres`
 * section, using Radix Tabs instead of the inline `onclick` script (accessible
 * keyboard/focus handling for free).
 *
 * Static: tabs, audience grid, CTA block. Dynamic: the cards, split by
 * `Offer.kind`, each opening the shared drawer via `?offer=<slug>`.
 */
export function OffersSection({ offers }: { offers: OfferWithImage[] }) {
  const copy = SECTION_COPY.offers;
  const byKind = (k: Kind) => offers.filter((o) => o.kind === k);

  return (
    <Section id="offers">
      <SectionHeader
        eyebrow={copy.eyebrow}
        titleLead={copy.titleLead}
        titleEm={copy.titleEm}
        sub={copy.sub}
      />

      <Tabs.Root defaultValue="diagnostic">
        {/* .tabs */}
        <Tabs.List className="mb-8 flex w-fit overflow-hidden rounded-md border border-line">
          {OFFERS_TABS.map((t) => (
            <Tabs.Trigger
              key={t.value}
              value={t.value}
              className="inline-flex items-center gap-2 bg-surface-white px-7 py-2.5 text-[0.78rem] uppercase tracking-[1px] text-ink-muted transition-all duration-200 hover:bg-teal-ultra hover:text-teal data-[state=active]:bg-teal data-[state=active]:text-white"
            >
              <Icon name={t.icon} className="h-4 w-4" />
              {t.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {(['diagnostic', 'formation'] as Kind[]).map((kind) => {
          const items = byKind(kind);
          const audience = OFFERS_AUDIENCE[kind];
          return (
            <Tabs.Content key={kind} value={kind} className="focus-visible:outline-none">
              {items.length === 0 ? (
                <EmptyState
                  icon={<Package className="h-8 w-8" strokeWidth={1.25} />}
                  message="Packages are being put together — get in touch to discuss your needs directly."
                  action={
                    <a
                      href="#contact"
                      className="inline-block rounded bg-teal px-7 py-[13px] text-[0.8rem] uppercase tracking-[1px] text-white transition-colors hover:bg-teal-dark"
                    >
                      Me contacter
                    </a>
                  }
                />
              ) : kind === 'diagnostic' ? (
                <div className="grid-lines mb-8 grid overflow-hidden rounded-lg sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((o, i) => (
                    <DiagnosticCard key={o.id} offer={o} index={i} />
                  ))}
                </div>
              ) : (
                <div className="mb-8 grid gap-[1.2rem] sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((o) => (
                    <FormationCard key={o.id} offer={o} />
                  ))}
                </div>
              )}

              {/* Audience grid — static */}
              <p className="mb-[0.8rem] text-[0.68rem] uppercase tracking-[2px] text-ink-muted">
                {audience.label}
              </p>
              <div className="grid-lines mb-6 grid grid-cols-2 overflow-hidden rounded-md md:grid-cols-4">
                {audience.items.map((a) => (
                  <div key={a.label} className="bg-teal-ultra p-[1.1rem] text-center">
                    <div className="mb-1.5 flex justify-center text-teal">
                      <Icon name={a.icon} className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <div className="text-[0.75rem] font-medium text-ink">{a.label}</div>
                    <div className="mt-[2px] text-[0.62rem] text-ink-muted">{a.sub}</div>
                  </div>
                ))}
              </div>

              {/* .cta-off — static */}
              <div className="flex flex-wrap items-center gap-4 rounded-lg border border-line bg-teal-ultra px-8 py-[1.8rem]">
                <div className="flex-1">
                  <p className="mb-[3px] font-display text-[1.1rem] text-ink">
                    {audience.cta.title}
                  </p>
                  <p className="text-[0.78rem] text-ink-muted">{audience.cta.sub}</p>
                </div>
                <a
                  href={`mailto:${CONTACT_DIRECT.email}`}
                  className="inline-block rounded bg-teal px-7 py-[13px] text-[0.8rem] uppercase tracking-[1px] text-white transition-all duration-200 hover:-translate-y-px hover:bg-teal-dark"
                >
                  {OFFERS_CTA_BUTTONS.primary}
                </a>
                <a
                  href={CONTACT_DIRECT.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded border-[1.5px] border-teal px-7 py-[13px] text-[0.8rem] uppercase tracking-[1px] text-teal transition-all duration-200 hover:bg-teal-ultra"
                >
                  {OFFERS_CTA_BUTTONS.outline}
                </a>
              </div>
            </Tabs.Content>
          );
        })}
      </Tabs.Root>
    </Section>
  );
}

/** `.diag-card` — corner badge, big ghost number, emoji, checklist, duration pill. */
function DiagnosticCard({ offer, index }: { offer: OfferWithImage; index: number }) {
  return (
    <Link
      href={`?offer=${offer.slug}`}
      scroll={false}
      className="relative block bg-surface-white p-8 transition-colors duration-200 hover:bg-teal-ultra focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal"
    >
      {offer.badge && (
        <span className="absolute right-[1.2rem] top-[1.2rem] rounded border border-line bg-teal-ultra px-2 py-1 text-[0.62rem] uppercase tracking-[1px] text-teal">
          {offer.badge}
        </span>
      )}
      <div className="mb-[0.8rem] font-display text-[2.5rem] font-bold leading-none text-teal-light">
        {String(index + 1).padStart(2, '0')}
      </div>
      <p className="mb-2 text-[1rem] font-medium text-ink">{offer.name}</p>
      <p className="mb-[1.2rem] text-[0.8rem] leading-[1.7] text-ink-muted">
        {stripHtml(offer.description)}
      </p>

      {offer.deliverables.length > 0 && (
        <div className="mb-[1.2rem] flex flex-col gap-[5px]">
          {offer.deliverables.map((d) => (
            <div key={d} className="flex items-start gap-[7px] text-[0.77rem] text-ink-mid">
              <span className="mt-[2px] flex-shrink-0 text-[0.72rem] font-bold text-teal">✓</span>
              {d}
            </div>
          ))}
        </div>
      )}

      <OfferMeta offer={offer} />
    </Link>
  );
}

/** `.form-card` — teal header block (name, level) over a body with modules + price/duration. */
function FormationCard({ offer }: { offer: OfferWithImage }) {
  return (
    <Link
      href={`?offer=${offer.slug}`}
      scroll={false}
      className="block overflow-hidden rounded-lg border border-line bg-surface-white transition-shadow duration-200 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
    >
      <div className="border-b border-line bg-teal-ultra px-[1.6rem] py-[1.4rem]">
        <p className="text-[0.95rem] font-medium leading-[1.3] text-ink">{offer.name}</p>
        {offer.badge && (
          <p className="mt-1 text-[0.65rem] uppercase tracking-[1px] text-teal">{offer.badge}</p>
        )}
      </div>
      <div className="px-[1.6rem] py-[1.4rem]">
        <p className="mb-4 text-[0.8rem] leading-[1.7] text-ink-muted">
          {stripHtml(offer.description)}
        </p>
        {offer.deliverables.length > 0 && (
          <div className="mb-[1.2rem] flex flex-col gap-1">
            {offer.deliverables.map((m) => (
              <div key={m} className="flex items-start gap-[7px] text-[0.75rem] text-ink-mid">
                <span className="flex-shrink-0 text-teal-bright">→</span>
                {m}
              </div>
            ))}
          </div>
        )}
        <OfferMeta offer={offer} />
      </div>
    </Link>
  );
}

/** Duration pill + price, shared by both card shapes. Renders nothing when unset. */
function OfferMeta({ offer }: { offer: OfferWithImage }) {
  const duration = formatDuration(offer.durationValue, offer.durationUnit);
  const price = formatPrice(offer.priceAmount, offer.priceCurrency);
  if (!duration && !price) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {duration && (
        <span className="inline-flex items-center rounded-sm border border-line bg-teal-ultra px-2.5 py-1 text-[0.68rem] uppercase tracking-[1px] text-teal">
          {duration}
        </span>
      )}
      {price && <span className="text-[0.85rem] font-medium text-teal">{price}</span>}
    </div>
  );
}
