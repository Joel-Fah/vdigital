'use server';

import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { env } from '@/lib/env';
import { processUpload } from '@/lib/image';
import { uploadToR2, deleteFromR2, keyFromPublicUrl } from '@/lib/r2';
import { uploadMediaSchema, updateAltSchema, importPexelsSchema } from '@/lib/validation/media';

export type ActionResult = { ok: boolean; error?: string };

/** Upload → sniff/resize/compress → R2 → MediaAsset (Section 7.6). */
export async function uploadMediaAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  if (!env.r2.isConfigured) {
    return { ok: false, error: 'Stockage R2 non configuré. Renseignez les variables R2_*.' };
  }

  const parsed = uploadMediaSchema.safeParse({ altText: formData.get('altText') });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Champs invalides.' };
  }

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: 'Aucun fichier sélectionné.' };
  }

  try {
    const raw = Buffer.from(await file.arrayBuffer());
    const processed = await processUpload(raw);
    const key = `uploads/${randomUUID()}.${processed.ext}`;
    const url = await uploadToR2(key, processed.buffer, processed.contentType);

    await prisma.mediaAsset.create({
      data: {
        url,
        altText: parsed.data.altText,
        source: 'upload',
        width: processed.width,
        height: processed.height,
        bytes: processed.bytes,
        contentType: processed.contentType,
      },
    });
    revalidatePath(`/${env.ADMIN_BASE_PATH}/media`);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Échec du téléversement.' };
  }
}

/** Attach a Pexels photo as a placeholder MediaAsset (Section 7). */
export async function importPexelsAction(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = importPexelsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Données Pexels invalides.' };
  const { pexelsId, url, altText, credit, width, height } = parsed.data;

  await prisma.mediaAsset.create({
    data: {
      url,
      altText: altText || null,
      source: 'pexels',
      pexelsId,
      pexelsCredit: credit || null,
      width,
      height,
      contentType: 'image/jpeg',
    },
  });
  revalidatePath(`/${env.ADMIN_BASE_PATH}/media`);
  return { ok: true };
}

export async function updateAltAction(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = updateAltSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };
  await prisma.mediaAsset.update({
    where: { id: parsed.data.id },
    data: { altText: parsed.data.altText },
  });
  revalidatePath(`/${env.ADMIN_BASE_PATH}/media`);
  return { ok: true };
}

export async function deleteMediaAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) return { ok: false, error: 'Introuvable.' };

  // Best-effort object cleanup for R2-hosted uploads (Pexels URLs stay remote).
  if (asset.source === 'upload' && env.r2.isConfigured) {
    const key = keyFromPublicUrl(asset.url);
    if (key) await deleteFromR2(key).catch((e) => console.error('[media] R2 delete failed:', e));
  }
  await prisma.mediaAsset.delete({ where: { id } });
  revalidatePath(`/${env.ADMIN_BASE_PATH}/media`);
  return { ok: true };
}
