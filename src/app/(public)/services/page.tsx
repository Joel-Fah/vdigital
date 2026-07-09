import type { Metadata } from 'next';
import { Section, SectionHeader } from '@/components/ui/section';
import { ServicesList } from '@/components/listing/services-list';
import { getServicesPage } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Services',
  description: "L'ensemble des services de communication digitale proposés par VDIGITAL.",
};

export const revalidate = 3600;

export default async function ServicesPage() {
  const { items, nextCursor } = await getServicesPage();

  return (
    <Section>
      <SectionHeader
        eyebrow="— Ce que je fais"
        titleLead="Tous mes "
        titleEm="Services"
        sub="Une offre complète de communication digitale pour faire rayonner votre marque sur tous les réseaux."
      />
      <ServicesList initialItems={items} initialCursor={nextCursor} />
    </Section>
  );
}
