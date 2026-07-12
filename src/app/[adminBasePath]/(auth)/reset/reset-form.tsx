'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Field, Input } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { resetAction, type ResetState } from './actions';

export function ResetForm({ token, loginHref }: { token: string; loginHref: string }) {
  const [state, formAction, pending] = useActionState<ResetState, FormData>(
    resetAction.bind(null, token),
    {},
  );

  if (state.done) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <CheckCircle2 className="h-9 w-9 text-teal" />
        <p className="text-[0.9rem] font-medium text-ink">Mot de passe mis à jour</p>
        <Link
          href={loginHref}
          className="mt-1 inline-block rounded bg-teal px-6 py-2.5 text-[0.8rem] uppercase tracking-wide text-white hover:bg-teal-dark"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Nouveau mot de passe" htmlFor="password" required>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          autoFocus
        />
      </Field>
      <Field label="Confirmer le mot de passe" htmlFor="confirm" required>
        <Input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </Field>
      {state.error && <p className="text-[0.8rem] text-red-600">{state.error}</p>}
      <Button type="submit" variant="primary" className="w-full" disabled={pending}>
        {pending ? 'Mise à jour…' : 'Définir le mot de passe'}
      </Button>
    </form>
  );
}
