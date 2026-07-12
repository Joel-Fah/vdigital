'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { validateResetToken, consumeResetToken } from '@/lib/password-reset';

export type ResetState = { error?: string; done?: boolean };

const schema = z
  .object({
    password: z.string().min(8, 'Au moins 8 caractères.').max(200),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Les mots de passe ne correspondent pas.',
    path: ['confirm'],
  });

/**
 * Complete a reset: validate the token, set a new argon2 hash, and consume the
 * token (single-use). Generic errors; the token is the only authorisation.
 */
export async function resetAction(
  token: string,
  _p: ResetState,
  formData: FormData,
): Promise<ResetState> {
  const email = await validateResetToken(token);
  if (!email) return { error: 'Lien invalide ou expiré. Refaites une demande.' };

  const parsed = schema.safeParse({
    password: formData.get('password'),
    confirm: formData.get('confirm'),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Champs invalides.' };

  try {
    const passwordHash = await hashPassword(parsed.data.password);
    await prisma.adminUser.update({ where: { email }, data: { passwordHash } });
    await consumeResetToken(token);
  } catch (err) {
    console.error('[reset] failed:', err);
    return { error: 'Une erreur est survenue. Réessayez.' };
  }
  return { done: true };
}
