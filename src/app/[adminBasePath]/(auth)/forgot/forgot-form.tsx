'use client';

import { useActionState, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Field, Input } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Turnstile } from '@/components/ui/turnstile';
import { forgotAction, type ForgotState } from './actions';

export function ForgotForm({ turnstileSiteKey }: { turnstileSiteKey?: string }) {
  const [state, formAction, pending] = useActionState<ForgotState, FormData>(forgotAction, {});
  const [token, setToken] = useState('');

  if (state.done) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <CheckCircle2 className="h-9 w-9 text-teal" />
        <p className="text-[0.9rem] font-medium text-ink">Vérifiez votre boîte mail</p>
        <p className="text-[0.8rem] text-ink-muted">
          Si un compte correspond à cette adresse, vous recevrez un lien de réinitialisation
          (valable 1 heure).
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <p className="text-[0.8rem] text-ink-muted">
        Saisissez votre email : nous vous enverrons un lien pour définir un nouveau mot de passe.
      </p>
      <input type="hidden" name="turnstileToken" value={token} />
      <Field label="Email" htmlFor="email" required>
        <Input id="email" name="email" type="email" autoComplete="username" required autoFocus />
      </Field>
      <Turnstile siteKey={turnstileSiteKey} onVerify={setToken} />
      {state.error && <p className="text-[0.8rem] text-red-600">{state.error}</p>}
      <Button type="submit" variant="primary" className="w-full" disabled={pending}>
        {pending ? 'Envoi…' : 'Envoyer le lien'}
      </Button>
    </form>
  );
}
