import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { adminPath } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { ExpertiseForm } from '@/components/admin/forms/expertise-form';
import { updateExpertiseAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditExpertisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.expertiseItem.findUnique({ where: { id } });
  if (!item) notFound();
  return (
    <div>
      <AdminHeader title="Modifier la compétence" subtitle={item.name} />
      <ExpertiseForm
        action={updateExpertiseAction.bind(null, item.id)}
        cancelHref={adminPath('expertise')}
        item={item}
      />
    </div>
  );
}
