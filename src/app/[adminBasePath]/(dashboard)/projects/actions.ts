'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireAdmin, adminPath } from '@/lib/admin';
import { uniqueSlug } from '@/lib/slug';
import { projectSchema, parseList, parseBool } from '@/lib/validation/entities';
import { sanitizeRichText } from '@/lib/html';

export type FormResult = { error?: string };

/** Parse the "label|value|trend" results textarea into structured objects. */
function parseResults(
  raw: FormDataEntryValue | null,
): { label: string; value: string; trend?: string }[] {
  const text = typeof raw === 'string' ? raw : '';
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, value, trend] = line.split('|').map((s) => s.trim());
      return { label: label ?? '', value: value ?? '', trend: trend || undefined };
    })
    .filter((r) => r.label && r.value)
    .slice(0, 8);
}

function readForm(formData: FormData) {
  return projectSchema.safeParse({
    title: formData.get('title'),
    client: formData.get('client'),
    category: formData.get('category'),
    summary: formData.get('summary'),
    link: formData.get('link'),
    coverImageId: formData.get('coverImageId'),
    tags: parseList(formData.get('tags'), 'comma'),
    results: parseResults(formData.get('results')),
    featured: parseBool(formData.get('featured')),
    visible: parseBool(formData.get('visible')),
    order: formData.get('order') ?? 0,
  });
}

export async function createProjectAction(_p: FormResult, formData: FormData): Promise<FormResult> {
  await requireAdmin();
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Champs invalides.' };
  const d = parsed.data;

  await prisma.project.create({
    data: {
      slug: await uniqueSlug('project', d.title),
      title: d.title,
      client: d.client ?? null,
      category: d.category ?? null,
      summary: sanitizeRichText(d.summary),
      link: d.link ?? null,
      coverImageId: d.coverImageId || null,
      tags: d.tags,
      resultsJson: d.results,
      featured: d.featured,
      visible: d.visible,
      order: d.order,
    },
  });
  finish();
}

export async function updateProjectAction(
  id: string,
  _p: FormResult,
  formData: FormData,
): Promise<FormResult> {
  await requireAdmin();
  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Champs invalides.' };
  const d = parsed.data;

  await prisma.project.update({
    where: { id },
    data: {
      slug: await uniqueSlug('project', d.title, id),
      title: d.title,
      client: d.client ?? null,
      category: d.category ?? null,
      summary: sanitizeRichText(d.summary),
      link: d.link ?? null,
      coverImageId: d.coverImageId || null,
      tags: d.tags,
      resultsJson: d.results,
      featured: d.featured,
      visible: d.visible,
      order: d.order,
    },
  });
  finish();
}

function finish(): never {
  revalidatePath('/');
  revalidatePath('/projects');
  revalidatePath(adminPath('projects'));
  redirect(adminPath('projects'));
}
