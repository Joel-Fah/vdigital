import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { searchPexels } from '@/lib/pexels';
import { env } from '@/lib/env';

export const runtime = 'nodejs';

/** Admin-only Pexels search proxy (keeps the API key server-side). */
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!env.pexels.isConfigured) {
    return NextResponse.json({ error: 'Pexels non configuré.', photos: [] }, { status: 200 });
  }

  const q = req.nextUrl.searchParams.get('q')?.trim();
  if (!q) return NextResponse.json({ photos: [] });
  const photos = await searchPexels(q);
  return NextResponse.json({ photos });
}
