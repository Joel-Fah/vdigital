import 'server-only';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

type SlugModel = 'project' | 'service' | 'offer';

/**
 * Generate a slug unique within a model, ignoring the record being edited.
 * Appends -2, -3, … on collision.
 */
export async function uniqueSlug(
  model: SlugModel,
  title: string,
  ignoreId?: string,
): Promise<string> {
  const base = slugify(title) || 'item';
  let candidate = base;
  let n = 1;
  for (;;) {
    const existing = await findBySlug(model, candidate);
    if (!existing || existing.id === ignoreId) return candidate;
    n += 1;
    candidate = `${base}-${n}`;
  }
}

function findBySlug(model: SlugModel, slug: string): Promise<{ id: string } | null> {
  if (model === 'project')
    return prisma.project.findUnique({ where: { slug }, select: { id: true } });
  if (model === 'service')
    return prisma.service.findUnique({ where: { slug }, select: { id: true } });
  return prisma.offer.findUnique({ where: { slug }, select: { id: true } });
}
