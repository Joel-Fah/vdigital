import { prisma } from '@/lib/prisma';
import { adminPath } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { ResourceList } from '@/components/admin/resource-list';

export const dynamic = 'force-dynamic';

export default async function AdminClientsPage() {
  const clients = await prisma.clientLogo.findMany({ orderBy: { order: 'asc' } });
  return (
    <div>
      <AdminHeader
        title="Clients"
        subtitle="Logos et références affichés sur le site."
        addHref={adminPath('clients/new')}
      />
      <ResourceList
        model="clientLogo"
        editHrefBase={adminPath('clients')}
        addHref={adminPath('clients/new')}
        rows={clients.map((c) => ({
          id: c.id,
          primary: c.name,
          secondary: c.sector ?? undefined,
          visible: c.visible,
        }))}
      />
    </div>
  );
}
