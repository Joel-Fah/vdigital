'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { env } from '@/lib/env';
import { clientIp } from '@/lib/ratelimit';
import { verifyTurnstile } from '@/lib/turnstile';
import { createResetToken } from '@/lib/password-reset';
import { sendPasswordResetEmail } from '@/lib/email';

export type ForgotState = { done?: boolean; error?: string };

/**
 * Request a reset link. Always returns a generic success (enumeration-safe): the
 * email is only sent if an admin with that address exists.
 */
export async function forgotAction(_p: ForgotState, formData: FormData): Promise<ForgotState> {
  const parsed = z.string().trim().email().safeParse(formData.get('email'));
  if (!parsed.success) return { error: 'Email invalide.' };
  const email = parsed.data;

  const ip = clientIp(await headers());
  if (!(await verifyTurnstile(formData.get('turnstileToken')?.toString(), ip))) {
    return { error: 'Vérification anti-robot échouée. Réessayez.' };
  }

  try {
    const token = await createResetToken(email);
    if (token) {
      const url = `${env.SITE_URL.replace(/\/$/, '')}/${env.ADMIN_BASE_PATH}/reset?token=${token}`;
      await sendPasswordResetEmail(email, url);
    }
  } catch (err) {
    console.error('[forgot] failed:', err);
    // Still generic — don't leak internal errors.
  }
  return { done: true };
}
