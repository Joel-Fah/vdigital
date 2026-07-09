'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { env } from '@/lib/env';

/**
 * Generic list operations shared by every content entity (delete / toggle
 * visibility / reorder). Centralised here so each entity's own actions file only
 * handles create+update. All are session-guarded server-side (Section 8.4).
 */
export type EntityModel =
  'project' | 'service' | 'clientLogo' | 'expertiseItem' | 'offer' | 'testimonial';

export type ActionResult = { ok: boolean; error?: string };

const PUBLIC_REVALIDATE = ['/', '/projects', '/services'];

function revalidateFor(model: EntityModel) {
  PUBLIC_REVALIDATE.forEach((p) => revalidatePath(p));
  revalidatePath(`/${env.ADMIN_BASE_PATH}/${listSegment(model)}`);
}

function listSegment(model: EntityModel): string {
  return {
    project: 'projects',
    service: 'services',
    clientLogo: 'clients',
    expertiseItem: 'expertise',
    offer: 'offers',
    testimonial: 'testimonials',
  }[model];
}

// Narrow, typed accessor for the delegate — avoids `any` while staying generic.
function delegate(model: EntityModel) {
  switch (model) {
    case 'project':
      return prisma.project;
    case 'service':
      return prisma.service;
    case 'clientLogo':
      return prisma.clientLogo;
    case 'expertiseItem':
      return prisma.expertiseItem;
    case 'offer':
      return prisma.offer;
    case 'testimonial':
      return prisma.testimonial;
  }
}

export async function deleteEntityAction(model: EntityModel, id: string): Promise<ActionResult> {
  await requireAdmin();
  // @ts-expect-error delegates share the id-based delete shape.
  await delegate(model).delete({ where: { id } });
  revalidateFor(model);
  return { ok: true };
}

export async function toggleVisibleAction(model: EntityModel, id: string): Promise<ActionResult> {
  await requireAdmin();
  const d = delegate(model);
  // @ts-expect-error shared { visible } field.
  const row = await d.findUnique({ where: { id }, select: { visible: true } });
  if (!row) return { ok: false, error: 'Introuvable.' };
  // @ts-expect-error shared { visible } field.
  await d.update({ where: { id }, data: { visible: !row.visible } });
  revalidateFor(model);
  return { ok: true };
}

/** Swap `order` with the adjacent row in the given direction. */
export async function reorderEntityAction(
  model: EntityModel,
  id: string,
  dir: 'up' | 'down',
): Promise<ActionResult> {
  await requireAdmin();
  const d = delegate(model);
  // @ts-expect-error shared { order } field.
  const current = await d.findUnique({ where: { id }, select: { id: true, order: true } });
  if (!current) return { ok: false, error: 'Introuvable.' };

  // @ts-expect-error shared { order } field.
  const neighbour = await d.findFirst({
    where: dir === 'up' ? { order: { lt: current.order } } : { order: { gt: current.order } },
    orderBy: { order: dir === 'up' ? 'desc' : 'asc' },
    select: { id: true, order: true },
  });
  if (!neighbour) return { ok: true }; // already at the edge

  await prisma.$transaction([
    // @ts-expect-error shared { order } field.
    d.update({ where: { id: current.id }, data: { order: neighbour.order } }),
    // @ts-expect-error shared { order } field.
    d.update({ where: { id: neighbour.id }, data: { order: current.order } }),
  ]);
  revalidateFor(model);
  return { ok: true };
}
