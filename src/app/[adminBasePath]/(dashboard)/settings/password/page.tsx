import { AdminHeader } from '@/components/admin/admin-header';
import { PasswordForm } from '@/components/admin/password-form';
import { adminPath } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export default function PasswordPage() {
  return (
    <div>
      <AdminHeader
        title="Changer le mot de passe"
        subtitle="Sécurisez l’accès à votre espace d’administration."
      />
      <PasswordForm cancelHref={adminPath('settings')} />
    </div>
  );
}
