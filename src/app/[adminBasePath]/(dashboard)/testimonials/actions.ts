'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAdmin, adminPath } from '@/lib/admin';
import { testimonialSchema, parseBool } from '@/lib/validation/entities';

export type FormResult = { error?: string };

function readForm(formData: FormData) {
  return testimonialSchema.safeParse({
    author: formData.get('author'),
    role: formData.get('role'),
    company: formData.get('company'),
    quote: formData.get('quote'),
    photoId: formData.get('photoId'),
    visible: parseBool(formData.get('visible')),
    order: formData.get('order') ?? 0,
  });
}

export async function createTestimonialAction(
  _p: FormResult,
  formData: FormData,
): Promise<FormResult> {
  await requireAdmin();
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Champs invalides.' };
  const d = parsed.data;
  await prisma.testimonial.create({
    data: {
      author: d.author,
      role: d.role ?? null,
      company: d.company ?? null,
      quote: d.quote,
      photoId: d.photoId || null,
      visible: d.visible,
      order: d.order,
    },
  });
  finish();
}

export async function updateTestimonialAction(
  id: string,
  _p: FormResult,
  formData: FormData,
): Promise<FormResult> {
  await requireAdmin();
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Champs invalides.' };
  const d = parsed.data;
  await prisma.testimonial.update({
    where: { id },
    data: {
      author: d.author,
      role: d.role ?? null,
      company: d.company ?? null,
      quote: d.quote,
      photoId: d.photoId || null,
      visible: d.visible,
      order: d.order,
    },
  });
  finish();
}

function finish(): never {
  revalidatePath('/');
  revalidatePath(adminPath('testimonials'));
  redirect(adminPath('testimonials'));
}
