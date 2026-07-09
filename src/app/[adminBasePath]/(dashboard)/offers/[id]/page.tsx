import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { adminPath } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { OfferForm } from '@/components/admin/forms/offer-form';
import { updateOfferAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditOfferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const offer = await prisma.offer.findUnique({ where: { id }, include: { image: true } });
  if (!offer) notFound();
  return (
    <div>
      <AdminHeader title="Modifier l'offre" subtitle={offer.name} />
      <OfferForm
        action={updateOfferAction.bind(null, offer.id)}
        cancelHref={adminPath('offers')}
        offer={offer}
        imageAsset={offer.image}
      />
    </div>
  );
}
