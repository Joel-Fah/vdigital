import type { Metadata } from 'next';
import { Section, SectionHeader } from '@/components/ui/section';
import { ProjectsList } from '@/components/listing/projects-list';
import { getProjectsPage } from '@/lib/content';
import { auth } from '@/lib/auth';
import { env } from '@/lib/env';

export const metadata: Metadata = {
  title: 'Réalisations',
  description: 'Études de cas et projets menés pour les marques accompagnées par VDIGITAL.',
};

export const revalidate = 3600;

export default async function ProjectsPage() {
  const [{ items, nextCursor }, session] = await Promise.all([getProjectsPage(), auth()]);
  const adminAddHref = session ? `/${env.ADMIN_BASE_PATH}/projects/new` : undefined;

  return (
    <Section>
      <SectionHeader
        eyebrow="— Preuves par les chiffres"
        titleLead="Toutes les études de "
        titleEm="Cas"
        sub="L'ensemble des études de cas, chargées au fil de votre défilement."
      />
      <ProjectsList initialItems={items} initialCursor={nextCursor} adminAddHref={adminAddHref} />
    </Section>
  );
}
