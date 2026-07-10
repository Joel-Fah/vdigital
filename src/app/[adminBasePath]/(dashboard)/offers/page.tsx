import { prisma } from '@/lib/prisma';
import { adminPath } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { ResourceList } from '@/components/admin/resource-list';

export const dynamic = 'force-dynamic';

export default async function AdminOffersPage() {
  const offers = await prisma.offer.findMany({ orderBy: { order: 'asc' } });
  return (
    <div>
      <AdminHeader
        title="Offres"
        subtitle="Diagnostics et formations, affichés dans les deux onglets de la section « Offres »."
        addHref={adminPath('offers/new')}
      />
      <ResourceList
        model="offer"
        editHrefBase={adminPath('offers')}
        addHref={adminPath('offers/new')}
        rows={offers.map((o) => ({
          id: o.id,
          primary: o.name,
          secondary: [o.kind === 'formation' ? 'Formation' : 'Diagnostic', o.badge]
            .filter(Boolean)
            .join(' · '),
          visible: o.visible,
        }))}
      />
    </div>
  );
}
