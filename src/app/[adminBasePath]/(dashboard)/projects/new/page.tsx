import { adminPath } from '@/lib/admin';
import { getProjectCategories, getProjectClients } from '@/lib/categories';
import { AdminHeader } from '@/components/admin/admin-header';
import { ProjectForm } from '@/components/admin/forms/project-form';
import { createProjectAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function NewProjectPage() {
  const [categories, clients] = await Promise.all([getProjectCategories(), getProjectClients()]);
  return (
    <div>
      <AdminHeader title="Nouveau projet" />
      <ProjectForm
        action={createProjectAction}
        cancelHref={adminPath('projects')}
        categories={categories}
        clients={clients}
      />
    </div>
  );
}
