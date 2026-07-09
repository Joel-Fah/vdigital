import { adminPath } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { ProjectForm } from '@/components/admin/forms/project-form';
import { createProjectAction } from '../actions';

export default function NewProjectPage() {
  return (
    <div>
      <AdminHeader title="Nouveau projet" />
      <ProjectForm action={createProjectAction} cancelHref={adminPath('projects')} />
    </div>
  );
}
