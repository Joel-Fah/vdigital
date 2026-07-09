import { NextRequest, NextResponse } from 'next/server';
import { getServicesPage } from '@/lib/content';

/**
 * Paginated public services feed (Section 5.1). Cursor pagination via Prisma.
 * GET /api/services?cursor=<id> → { items, nextCursor }
 */
export async function GET(req: NextRequest) {
  const cursor = req.nextUrl.searchParams.get('cursor') ?? undefined;
  const page = await getServicesPage(cursor);
  return NextResponse.json(page);
}
