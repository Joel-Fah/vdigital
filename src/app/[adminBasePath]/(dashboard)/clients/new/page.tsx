import { adminPath } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { ClientForm } from '@/components/admin/forms/client-form';
import { createClientAction } from '../actions';

export default function NewClientPage() {
  return (
    <div>
      <AdminHeader title="Nouveau client" />
      <ClientForm action={createClientAction} cancelHref={adminPath('clients')} />
    </div>
  );
}
