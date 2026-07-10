'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin, adminPath } from '@/lib/admin';

export type ActionResult = { ok: boolean; error?: string };

export async function toggleSectionVisibleAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const s = await prisma.section.findUnique({
    where: { id },
    select: { visible: true, key: true },
  });
  if (!s) return { ok: false, error: 'Introuvable.' };
  // The hero is the page header; keep it always visible.
  if (s.key === 'hero') return { ok: false, error: 'La section Hero ne peut pas être masquée.' };
  await prisma.section.update({ where: { id }, data: { visible: !s.visible } });
  revalidate();
  return { ok: true };
}

export async function reorderSectionAction(id: string, dir: 'up' | 'down'): Promise<ActionResult> {
  await requireAdmin();
  const current = await prisma.section.findUnique({
    where: { id },
    select: { id: true, order: true },
  });
  if (!current) return { ok: false, error: 'Introuvable.' };
  const neighbour = await prisma.section.findFirst({
    where: dir === 'up' ? { order: { lt: current.order } } : { order: { gt: current.order } },
    orderBy: { order: dir === 'up' ? 'desc' : 'asc' },
    select: { id: true, order: true },
  });
  if (!neighbour) return { ok: true };
  await prisma.$transaction([
    prisma.section.update({ where: { id: current.id }, data: { order: neighbour.order } }),
    prisma.section.update({ where: { id: neighbour.id }, data: { order: current.order } }),
  ]);
  revalidate();
  return { ok: true };
}

/** Persist a full drag-and-drop reorder: order = position in `orderedIds`. */
export async function reorderSectionsAction(orderedIds: string[]): Promise<ActionResult> {
  await requireAdmin();
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) return { ok: false };
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.section.update({ where: { id }, data: { order: index } })),
  );
  revalidate();
  return { ok: true };
}

function revalidate() {
  revalidatePath('/');
  revalidatePath(adminPath('sections'));
}
