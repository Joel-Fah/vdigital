import { prisma } from '@/lib/prisma';
import { adminPath } from '@/lib/admin';
import { AdminHeader } from '@/components/admin/admin-header';
import { SettingsForm } from '@/components/admin/settings-form';
import Link from 'next/link';

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
      <div className="mt-8 border-t border-line pt-6">
        <h2 className="font-display text-[1.1rem] font-bold text-ink">Sécurité</h2>
        <p className="mt-1 text-[0.8rem] text-ink-muted">
          Modifiez votre mot de passe sans utiliser la procédure de réinitialisation par email.
        </p>
        <Link
          href={adminPath('settings/password')}
          className="mt-3 inline-flex rounded border border-teal px-4 py-2 text-[0.78rem] font-medium uppercase tracking-wide text-teal transition-colors hover:bg-teal-ultra"
        >
          Changer le mot de passe
        </Link>
      </div>
    </div>
  );
}
