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
        subtitle="Jusqu'à 6 témoignages « mis en avant » s'affichent sur l'accueil ; les autres dans le panneau latéral. Sans sélection, 6 sont choisis au hasard."
        addHref={adminPath('testimonials/new')}
      />
      <ResourceList
        model="testimonial"
        editHrefBase={adminPath('testimonials')}
        addHref={adminPath('testimonials/new')}
        rows={items.map((t) => ({
          id: t.id,
          primary: t.author,
          secondary:
            [t.featured ? 'Mis en avant' : null, t.role, t.company].filter(Boolean).join(' · ') ||
            undefined,
          visible: t.visible,
        }))}
      />
    </div>
  );
}
