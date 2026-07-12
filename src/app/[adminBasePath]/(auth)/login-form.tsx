'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { Field, Input } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Turnstile } from '@/components/ui/turnstile';
import { loginAction, type LoginState } from './actions';

export function LoginForm({
  turnstileSiteKey,
  forgotHref,
}: {
  turnstileSiteKey?: string;
  forgotHref: string;
}) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, {});
  const [token, setToken] = useState('');

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="turnstileToken" value={token} />

      <Field label="Email" htmlFor="email" required>
        <Input id="email" name="email" type="email" autoComplete="username" required autoFocus />
      </Field>

      <Field label="Mot de passe" htmlFor="password" required>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>

      <Turnstile siteKey={turnstileSiteKey} onVerify={setToken} />

      {state.error && <p className="text-[0.8rem] text-red-600">{state.error}</p>}

      <Button type="submit" variant="primary" className="w-full" disabled={pending}>
        {pending ? 'Connexion…' : 'Se connecter'}
      </Button>

      <Link
        href={forgotHref}
        className="block text-center text-[0.78rem] text-ink-muted hover:text-teal"
      >
        Mot de passe oublié ?
      </Link>
    </form>
  );
}
