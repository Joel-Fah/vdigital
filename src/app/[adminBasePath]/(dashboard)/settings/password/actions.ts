'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { adminPath, requireAdmin } from '@/lib/admin';
import { hashPassword, verifyPassword } from '@/lib/password';
import { signOut } from '@/lib/auth';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(12, 'Le nouveau mot de passe doit contenir au moins 12 caractères.'),
    confirmPassword: z.string(),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: 'La confirmation ne correspond pas au nouveau mot de passe.',
    path: ['confirmPassword'],
  });

export type PasswordFormResult = { error?: string };

export async function changePasswordAction(
  _previous: PasswordFormResult,
  formData: FormData,
): Promise<PasswordFormResult> {
  const session = await requireAdmin();
  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Champs invalides.' };

  const user = await prisma.adminUser.findUnique({ where: { id: session.user.id } });
  if (!user || !(await verifyPassword(user.passwordHash, parsed.data.currentPassword))) {
    return { error: 'Le mot de passe actuel est incorrect.' };
  }
  if (await verifyPassword(user.passwordHash, parsed.data.newPassword)) {
    return { error: 'Le nouveau mot de passe doit être différent de l’ancien.' };
  }

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(parsed.data.newPassword) },
  });

  await signOut({ redirect: false });
  redirect(adminPath());
}
