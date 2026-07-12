import 'server-only';
import { prisma } from '@/lib/prisma';

/** Distinct, non-empty project categories — powers the category combobox. */
export async function getProjectCategories(): Promise<string[]> {
  try {
    const rows = await prisma.project.findMany({
      where: { category: { not: null } },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return rows.map((r) => r.category!).filter(Boolean);
  } catch {
    return [];
  }
}
