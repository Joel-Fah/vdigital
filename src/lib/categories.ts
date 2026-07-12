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

/** Distinct, non-empty project clients — powers the client combobox. */
export async function getProjectClients(): Promise<string[]> {
  try {
    const rows = await prisma.project.findMany({
      where: { client: { not: null } },
      select: { client: true },
      distinct: ['client'],
      orderBy: { client: 'asc' },
    });
    return rows.map((r) => r.client!).filter(Boolean);
  } catch {
    return [];
  }
}
