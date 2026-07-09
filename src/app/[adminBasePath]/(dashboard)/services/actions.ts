'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAdmin, adminPath } from '@/lib/admin';
import { uniqueSlug } from '@/lib/slug';
import { serviceSchema, parseList, parseBool } from '@/lib/validation/entities';

export type FormResult = { error?: string };

function readForm(formData: FormData) {
  return serviceSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    iconId: formData.get('iconId'),
    tags: parseList(formData.get('tags'), 'comma'),
    featured: parseBool(formData.get('featured')),
    visible: parseBool(formData.get('visible')),
    order: formData.get('order') ?? 0,
  });
}

export async function createServiceAction(_p: FormResult, formData: FormData): Promise<FormResult> {
  await requireAdmin();
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Champs invalides.' };
  const d = parsed.data;
  await prisma.service.create({
    data: {
      slug: await uniqueSlug('service', d.title),
      title: d.title,
      description: d.description,
      iconId: d.iconId || null,
      tags: d.tags,
      featured: d.featured,
      visible: d.visible,
      order: d.order,
    },
  });
  finish();
}

export async function updateServiceAction(
  id: string,
  _p: FormResult,
  formData: FormData,
): Promise<FormResult> {
  await requireAdmin();
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Champs invalides.' };
  const d = parsed.data;
  await prisma.service.update({
    where: { id },
    data: {
      slug: await uniqueSlug('service', d.title, id),
      title: d.title,
      description: d.description,
      iconId: d.iconId || null,
      tags: d.tags,
      featured: d.featured,
      visible: d.visible,
      order: d.order,
    },
  });
  finish();
}

function finish(): never {
  revalidatePath('/');
  revalidatePath('/services');
  revalidatePath(adminPath('services'));
  redirect(adminPath('services'));
}
