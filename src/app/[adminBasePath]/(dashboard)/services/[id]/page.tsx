import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { adminPath } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { ServiceForm } from '@/components/admin/forms/service-form';
import { updateServiceAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id }, include: { icon: true } });
  if (!service) notFound();
  return (
    <div>
      <AdminHeader title="Modifier le service" subtitle={service.title} />
      <ServiceForm
        action={updateServiceAction.bind(null, service.id)}
        cancelHref={adminPath('services')}
        service={service}
        iconAsset={service.icon}
      />
    </div>
  );
}
