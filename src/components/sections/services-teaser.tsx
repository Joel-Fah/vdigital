import type { MediaAsset, Service } from '@prisma/client';
import { PenTool } from 'lucide-react';
import { Section, SectionHeader } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Reveal } from '@/components/ui/reveal';
import { ServiceCard } from '@/components/cards/service-card';
import { SECTION_COPY } from '@/content/static-copy';

type ServiceWithIcon = Service & { icon: MediaAsset | null };

/**
 * Services teaser — `.section.alt#services` with the original 2-column
 * `.services-grid` (1px background-gap dividers). Cards are DB-driven; the
 * header copy is a verbatim rebuild.
 */
export function ServicesTeaser({ services }: { services: ServiceWithIcon[] }) {
  const copy = SECTION_COPY.services;
  return (
    <Section id="services" alt>
      <SectionHeader
        eyebrow={copy.eyebrow}
        titleLead={copy.titleLead}
        titleEm={copy.titleEm}
        sub={copy.sub}
      />

      {services.length === 0 ? (
        <EmptyState
          icon={<PenTool className="h-8 w-8" strokeWidth={1.25} />}
          message="Services are being finalised — check back shortly."
        />
      ) : (
        <>
          <div className="grid-lines grid overflow-hidden md:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.05}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button href="/services" variant="outline">
              Voir tous les services
            </Button>
          </div>
        </>
      )}
    </Section>
  );
}
