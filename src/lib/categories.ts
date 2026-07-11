import 'server-only';
import { prisma } from '@/lib/prisma';
import { withRetry } from '@/lib/db-retry';

/** Distinct, non-empty project categories — powers the category combobox. */
export async function getProjectCategories(): Promise<string[]> {
  try {
    const rows = await withRetry(() =>
      prisma.project.findMany({
        where: { category: { not: null } },
        select: { category: true },
        distinct: ['category'],
        orderBy: { category: 'asc' },
      }),
    );
    return rows.map((r) => r.category!).filter(Boolean);
  } catch {
    return [];
  }
}
