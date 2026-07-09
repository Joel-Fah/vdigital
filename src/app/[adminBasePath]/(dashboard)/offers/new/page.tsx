import { adminPath } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { OfferForm } from '@/components/admin/forms/offer-form';
import { createOfferAction } from '../actions';

export default function NewOfferPage() {
  return (
    <div>
      <AdminHeader title="Nouvelle offre" />
      <OfferForm action={createOfferAction} cancelHref={adminPath('offers')} />
    </div>
  );
}
