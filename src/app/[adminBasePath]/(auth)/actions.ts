'use server';

import { headers } from 'next/headers';
import { unstable_rethrow } from 'next/navigation';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { signIn } from '@/lib/auth';
import { env } from '@/lib/env';
import { verifyTurnstile } from '@/lib/turnstile';
import { clientIp, isLoginBlocked, recordLoginAttempt } from '@/lib/ratelimit';

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
  turnstileToken: z.string().optional(),
});

export type LoginState = { error?: string };

/**
 * Login server action (Section 8.3). Order matters:
 *  1. Validate input.
 *  2. Verify Turnstile (bot protection).
 *  3. Enforce rate limit (5 fails / 15 min per email or IP) with a generic
 *     "too many attempts" message.
 *  4. Attempt credential sign-in; log success/failure to LoginAttempt.
 *  5. Generic "invalid email or password" — never reveal whether the email exists.
 */
export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    turnstileToken: formData.get('turnstileToken') ?? undefined,
  });
  if (!parsed.success) return { error: 'Email ou mot de passe invalide.' };

  const { email, password, turnstileToken } = parsed.data;
  const hdrs = await headers();
  const ip = clientIp(hdrs);

  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return { error: 'Vérification anti-robot échouée. Réessayez.' };
  }

  if ((await isLoginBlocked(email)) || (await isLoginBlocked(ip))) {
    return { error: 'Trop de tentatives. Réessayez dans quelques minutes.' };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: `/${env.ADMIN_BASE_PATH}/dashboard`,
    });
  } catch (err) {
    // A successful signIn throws NEXT_REDIRECT — let framework errors propagate.
    unstable_rethrow(err);
    if (err instanceof AuthError) {
      await recordLoginAttempt(email, false);
      await recordLoginAttempt(ip, false);
      return { error: 'Email ou mot de passe invalide.' };
    }
    throw err;
  }

  // Unreachable on success (redirect thrown above). Success is logged in authorize().
  return {};
}
