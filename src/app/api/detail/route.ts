import { NextRequest, NextResponse } from 'next/server';
import { getProjectBySlug, getServiceBySlug, getOfferBySlug } from '@/lib/content';

/**
 * Unified detail endpoint backing the right-side drawer (Section 5.3).
 * GET /api/detail?type=project|service|offer&slug=<slug>
 *
 * Public + read-only; only returns `visible` records.
 */
export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type');
  const slug = req.nextUrl.searchParams.get('slug');

  if (!slug || !type) {
    return NextResponse.json({ error: 'Missing type or slug' }, { status: 400 });
  }

  let data:
    | Awaited<ReturnType<typeof getProjectBySlug>>
    | Awaited<ReturnType<typeof getServiceBySlug>>
    | Awaited<ReturnType<typeof getOfferBySlug>>
    | null = null;

  if (type === 'project') data = await getProjectBySlug(slug);
  else if (type === 'service') data = await getServiceBySlug(slug);
  else if (type === 'offer') data = await getOfferBySlug(slug);
  else return NextResponse.json({ error: 'Unknown type' }, { status: 400 });

  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ type, data });
}
