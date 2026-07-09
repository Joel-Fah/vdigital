import { prisma } from '@/lib/prisma';
import { adminPath } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { ResourceList } from '@/components/admin/resource-list';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } });
  return (
    <div>
      <AdminHeader
        title="Projets"
        subtitle="Études de cas affichées sur la page d'accueil et /projects."
        addHref={adminPath('projects/new')}
      />
      <ResourceList
        model="project"
        editHrefBase={adminPath('projects')}
        addHref={adminPath('projects/new')}
        rows={projects.map((p) => ({
          id: p.id,
          primary: p.title,
          secondary: [p.client, p.featured ? 'Mis en avant' : null].filter(Boolean).join(' · '),
          visible: p.visible,
        }))}
      />
    </div>
  );
}
