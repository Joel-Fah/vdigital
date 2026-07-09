import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { adminPath } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { ProjectForm } from '@/components/admin/forms/project-form';
import { updateProjectAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id }, include: { coverImage: true } });
  if (!project) notFound();

  return (
    <div>
      <AdminHeader title="Modifier le projet" subtitle={project.title} />
      <ProjectForm
        action={updateProjectAction.bind(null, project.id)}
        cancelHref={adminPath('projects')}
        project={project}
        coverAsset={project.coverImage}
      />
    </div>
  );
}
