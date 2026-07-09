import { adminPath } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { ServiceForm } from '@/components/admin/forms/service-form';
import { createServiceAction } from '../actions';

export default function NewServicePage() {
  return (
    <div>
      <AdminHeader title="Nouveau service" />
      <ServiceForm action={createServiceAction} cancelHref={adminPath('services')} />
    </div>
  );
}
