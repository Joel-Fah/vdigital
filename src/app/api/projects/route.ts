import { NextRequest, NextResponse } from 'next/server';
import { getProjectsPage } from '@/lib/content';

/**
 * Paginated public projects feed (Section 5.1). Cursor pagination via Prisma.
 * GET /api/projects?cursor=<id> → { items, nextCursor }
 */
export async function GET(req: NextRequest) {
  const cursor = req.nextUrl.searchParams.get('cursor') ?? undefined;
  const page = await getProjectsPage(cursor);
  return NextResponse.json(page);
}
