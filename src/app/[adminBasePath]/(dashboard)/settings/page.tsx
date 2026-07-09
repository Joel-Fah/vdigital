import { prisma } from '@/lib/prisma';
import { adminPath } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { SettingsForm } from '@/components/admin/settings-form';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  return (
    <div>
      <AdminHeader
        title="Réglages du site"
        subtitle="SEO, contact, réseaux sociaux et analytics."
      />
      <SettingsForm settings={settings} cancelHref={adminPath('dashboard')} />
    </div>
  );
}
