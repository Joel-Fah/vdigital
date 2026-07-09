import type { ClientLogo, MediaAsset } from '@prisma/client';
import { Section, SectionHeader } from '@/components/ui/section';
import { EmptyState } from '@/components/ui/empty-state';
import { Reveal } from '@/components/ui/reveal';
import { ClientCard } from '@/components/cards/client-card';
import { SECTION_COPY, SECTORS } from '@/content/static-copy';

type ClientWithLogo = ClientLogo & { logo: MediaAsset | null };

/**
 * "Références Clients" — DB-driven client list, followed by the static
 * `.sectors` pill row from the original (always shown; it describes the
 * practice, not individual clients).
 */
export function ClientsSection({ clients }: { clients: ClientWithLogo[] }) {
  const copy = SECTION_COPY.clients;
  return (
    <Section id="clients" alt>
      <SectionHeader
        eyebrow={copy.eyebrow}
        titleLead={copy.titleLead}
        titleEm={copy.titleEm}
        sub={copy.sub}
      />

      {clients.length === 0 ? (
        <EmptyState
          variant="chip"
          message="Client stories will be featured here soon."
          className="mx-auto max-w-md"
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.04}>
              <ClientCard client={c} variant="compact" />
            </Reveal>
          ))}
        </div>
      )}

      {/* .sectors — static */}
      <div className="mt-[1.2rem] flex flex-wrap gap-[7px]">
        {SECTORS.map((s) => (
          <span
            key={s}
            className="rounded-full border border-teal/20 bg-teal-ultra px-[14px] py-[5px] text-[0.7rem] text-teal"
          >
            {s}
          </span>
        ))}
      </div>
    </Section>
  );
}
