'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAdmin, adminPath } from '@/lib/admin';
import { uniqueSlug } from '@/lib/slug';
import { offerSchema, parseList, parseBool } from '@/lib/validation/entities';

export type FormResult = { error?: string };

function readForm(formData: FormData) {
  return offerSchema.safeParse({
    kind: formData.get('kind'),
    name: formData.get('name'),
    description: formData.get('description'),
    deliverables: parseList(formData.get('deliverables'), 'lines'),
    badge: formData.get('badge'),
    duration: formData.get('duration'),
    icon: formData.get('icon'),
    priceNote: formData.get('priceNote'),
    imageId: formData.get('imageId'),
    visible: parseBool(formData.get('visible')),
    order: formData.get('order') ?? 0,
  });
}

export async function createOfferAction(_p: FormResult, formData: FormData): Promise<FormResult> {
  await requireAdmin();
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Champs invalides.' };
  const d = parsed.data;
  await prisma.offer.create({
    data: {
      slug: await uniqueSlug('offer', d.name),
      kind: d.kind,
      name: d.name,
      description: d.description,
      deliverables: d.deliverables,
      badge: d.badge ?? null,
      duration: d.duration ?? null,
      icon: d.icon ?? null,
      priceNote: d.priceNote ?? null,
      imageId: d.imageId || null,
      visible: d.visible,
      order: d.order,
    },
  });
  finish();
}

export async function updateOfferAction(
  id: string,
  _p: FormResult,
  formData: FormData,
): Promise<FormResult> {
  await requireAdmin();
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Champs invalides.' };
  const d = parsed.data;
  await prisma.offer.update({
    where: { id },
    data: {
      slug: await uniqueSlug('offer', d.name, id),
      kind: d.kind,
      name: d.name,
      description: d.description,
      deliverables: d.deliverables,
      badge: d.badge ?? null,
      duration: d.duration ?? null,
      icon: d.icon ?? null,
      priceNote: d.priceNote ?? null,
      imageId: d.imageId || null,
      visible: d.visible,
      order: d.order,
    },
  });
  finish();
}

function finish(): never {
  revalidatePath('/');
  revalidatePath(adminPath('offers'));
  redirect(adminPath('offers'));
}
