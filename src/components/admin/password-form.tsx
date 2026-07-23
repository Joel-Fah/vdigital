'use client';

import { useActionState } from 'react';
import { Field, Input } from '@/components/ui/field';
import { FormActions, FormError } from '@/components/admin/form-shell';
import {
  changePasswordAction,
  type PasswordFormResult,
} from '@/app/[adminBasePath]/(dashboard)/settings/password/actions';

export function PasswordForm({ cancelHref }: { cancelHref: string }) {
  const [state, formAction] = useActionState<PasswordFormResult, FormData>(
    changePasswordAction,
    {},
  );

  return (
    <form action={formAction} className="max-w-md space-y-5">
      <FormError>{state.error}</FormError>
      <p className="rounded bg-gold/10 px-3 py-2 text-[0.8rem] text-ink-mid">
        Vous serez déconnecté après l&apos;enregistrement et devrez vous reconnecter avec le nouveau
        mot de passe.
      </p>
      <Field label="Mot de passe actuel" htmlFor="currentPassword" required>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>
      <Field
        label="Nouveau mot de passe"
        htmlFor="newPassword"
        hint="Au moins 12 caractères."
        required
      >
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
        />
      </Field>
      <Field label="Confirmer le nouveau mot de passe" htmlFor="confirmPassword" required>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
        />
      </Field>
      <FormActions cancelHref={cancelHref} submitLabel="Changer le mot de passe" />
    </form>
  );
}
