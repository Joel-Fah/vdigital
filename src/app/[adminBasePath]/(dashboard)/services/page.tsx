import { prisma } from '@/lib/prisma';
import { adminPath } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { ResourceList } from '@/components/admin/resource-list';

export const dynamic = 'force-dynamic';

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });
  return (
    <div>
      <AdminHeader
        title="Services"
        subtitle="Prestations affichées sur le site."
        addHref={adminPath('services/new')}
      />
      <ResourceList
        model="service"
        editHrefBase={adminPath('services')}
        addHref={adminPath('services/new')}
        rows={services.map((s) => ({
          id: s.id,
          primary: s.title,
          secondary: s.featured ? 'Mis en avant' : undefined,
          visible: s.visible,
        }))}
      />
    </div>
  );
}
