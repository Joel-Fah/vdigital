import { prisma } from '@/lib/prisma';
import { adminPath } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { ResourceList } from '@/components/admin/resource-list';

export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage() {
  const items = await prisma.testimonial.findMany({ orderBy: { order: 'asc' } });
  return (
    <div>
      <AdminHeader
        title="Témoignages"
        subtitle="La section se masque automatiquement s'il n'y en a aucun."
        addHref={adminPath('testimonials/new')}
      />
      <ResourceList
        model="testimonial"
        editHrefBase={adminPath('testimonials')}
        addHref={adminPath('testimonials/new')}
        rows={items.map((t) => ({
          id: t.id,
          primary: t.author,
          secondary: [t.role, t.company].filter(Boolean).join(' · ') || undefined,
          visible: t.visible,
        }))}
      />
    </div>
  );
}
