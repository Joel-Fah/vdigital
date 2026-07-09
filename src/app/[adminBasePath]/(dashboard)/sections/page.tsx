import { prisma } from '@/lib/prisma';
import { AdminHeader } from '@/components/admin/admin-header';
import { SectionOrderList } from '@/components/admin/section-order-list';

export const dynamic = 'force-dynamic';

export default async function SectionsPage() {
  const sections = await prisma.section.findMany({ orderBy: { order: 'asc' } });
  return (
    <div>
      <AdminHeader
        title="Sections de la page d'accueil"
        subtitle="Réorganisez et masquez les sections. Les changements sont immédiats, sans redéploiement."
      />
      <SectionOrderList sections={sections} />
    </div>
  );
}
