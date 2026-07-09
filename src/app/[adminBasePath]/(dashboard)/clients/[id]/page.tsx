import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { adminPath } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { ClientForm } from '@/components/admin/forms/client-form';
import { updateClientAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.clientLogo.findUnique({ where: { id }, include: { logo: true } });
  if (!client) notFound();
  return (
    <div>
      <AdminHeader title="Modifier le client" subtitle={client.name} />
      <ClientForm
        action={updateClientAction.bind(null, client.id)}
        cancelHref={adminPath('clients')}
        client={client}
        logoAsset={client.logo}
      />
    </div>
  );
}
