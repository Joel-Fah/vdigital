'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin, adminPath } from '@/lib/admin';
import { siteSettingsSchema } from '@/lib/validation/entities';

export type FormResult = { error?: string; ok?: boolean };

export async function updateSettingsAction(
  _p: FormResult,
  formData: FormData,
): Promise<FormResult> {
  await requireAdmin();
  const parsed = siteSettingsSchema.safeParse({
    seoTitle: formData.get('seoTitle'),
    seoDescription: formData.get('seoDescription'),
    contactEmail: formData.get('contactEmail'),
    contactPhone: formData.get('contactPhone'),
    analyticsId: formData.get('analyticsId'),
    instagram: formData.get('instagram'),
    linkedin: formData.get('linkedin'),
    tiktok: formData.get('tiktok'),
    facebook: formData.get('facebook'),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Champs invalides.' };
  const d = parsed.data;

  const socialLinks: Record<string, string> = {};
  if (d.instagram) socialLinks.instagram = d.instagram;
  if (d.linkedin) socialLinks.linkedin = d.linkedin;
  if (d.tiktok) socialLinks.tiktok = d.tiktok;
  if (d.facebook) socialLinks.facebook = d.facebook;

  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {
      seoTitle: d.seoTitle ?? null,
      seoDescription: d.seoDescription ?? null,
      contactEmail: d.contactEmail ?? null,
      contactPhone: d.contactPhone ?? null,
      analyticsId: d.analyticsId ?? null,
      socialLinks,
    },
    create: {
      id: 'singleton',
      seoTitle: d.seoTitle ?? null,
      seoDescription: d.seoDescription ?? null,
      contactEmail: d.contactEmail ?? null,
      contactPhone: d.contactPhone ?? null,
      analyticsId: d.analyticsId ?? null,
      socialLinks,
    },
  });

  revalidatePath('/');
  revalidatePath(adminPath('settings'));
  return { ok: true };
}
