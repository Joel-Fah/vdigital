import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

/** Admin-only media list for the MediaPicker (Section 8.4 — server-side auth check). */
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const items = await prisma.mediaAsset.findMany({
    orderBy: { uploadedAt: 'desc' },
    take: 200,
  });
  return NextResponse.json({ items });
}
