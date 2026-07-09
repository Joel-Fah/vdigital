import { adminPath } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { ExpertiseForm } from '@/components/admin/forms/expertise-form';
import { createExpertiseAction } from '../actions';

export default function NewExpertisePage() {
  return (
    <div>
      <AdminHeader title="Nouvelle compétence" />
      <ExpertiseForm action={createExpertiseAction} cancelHref={adminPath('expertise')} />
    </div>
  );
}
