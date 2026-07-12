import { NextResponse } from 'next/server';
import { getAllTestimonials } from '@/lib/content';

/** Public: all visible testimonials, backing the side-panel drawer (v1.2). */
export async function GET() {
  const items = await getAllTestimonials();
  return NextResponse.json({ items });
}
