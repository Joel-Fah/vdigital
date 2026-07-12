import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { adminPath } from '@/lib/admin';
import { getProjectCategories, getProjectClients } from '@/lib/categories';
import { AdminHeader } from '@/components/admin/admin-header';
import { ProjectForm } from '@/components/admin/forms/project-form';
import { updateProjectAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project, categories, clients] = await Promise.all([
    prisma.project.findUnique({ where: { id }, include: { coverImage: true } }),
    getProjectCategories(),
    getProjectClients(),
  ]);
  if (!project) notFound();

  return (
    <div>
      <AdminHeader title="Modifier le projet" subtitle={project.title} />
      <ProjectForm
        action={updateProjectAction.bind(null, project.id)}
        cancelHref={adminPath('projects')}
        project={project}
        coverAsset={project.coverImage}
        categories={categories}
        clients={clients}
      />
    </div>
  );
}
