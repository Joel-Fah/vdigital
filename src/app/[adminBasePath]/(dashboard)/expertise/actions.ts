'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAdmin, adminPath } from '@/lib/admin';
import { expertiseSchema, parseBool } from '@/lib/validation/entities';

export type FormResult = { error?: string };

function readForm(formData: FormData) {
  return expertiseSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    level: formData.get('level') ?? 0,
    visible: parseBool(formData.get('visible')),
    order: formData.get('order') ?? 0,
  });
}

export async function createExpertiseAction(
  _p: FormResult,
  formData: FormData,
): Promise<FormResult> {
  await requireAdmin();
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Champs invalides.' };
  const d = parsed.data;
  await prisma.expertiseItem.create({
    data: {
      name: d.name,
      description: d.description ?? null,
      level: d.level,
      visible: d.visible,
      order: d.order,
    },
  });
  finish();
}

export async function updateExpertiseAction(
  id: string,
  _p: FormResult,
  formData: FormData,
): Promise<FormResult> {
  await requireAdmin();
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Champs invalides.' };
  const d = parsed.data;
  await prisma.expertiseItem.update({
    where: { id },
    data: {
      name: d.name,
      description: d.description ?? null,
      level: d.level,
      visible: d.visible,
      order: d.order,
    },
  });
  finish();
}

function finish(): never {
  revalidatePath('/');
  revalidatePath(adminPath('expertise'));
  redirect(adminPath('expertise'));
}
