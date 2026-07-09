import { prisma } from '@/lib/prisma';
import { adminPath } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { ResourceList } from '@/components/admin/resource-list';

export const dynamic = 'force-dynamic';

export default async function AdminExpertisePage() {
  const items = await prisma.expertiseItem.findMany({ orderBy: { order: 'asc' } });
  return (
    <div>
      <AdminHeader
        title="Expertise"
        subtitle="Compétences et niveaux affichés en barres."
        addHref={adminPath('expertise/new')}
      />
      <ResourceList
        model="expertiseItem"
        editHrefBase={adminPath('expertise')}
        addHref={adminPath('expertise/new')}
        rows={items.map((e) => ({
          id: e.id,
          primary: e.name,
          secondary: `${e.level}%`,
          visible: e.visible,
        }))}
      />
    </div>
  );
}
