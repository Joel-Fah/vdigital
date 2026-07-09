import 'server-only';
import { env } from '@/lib/env';

/**
 * Pexels API client for placeholder images (Section 7). Free tier; we credit the
 * photographer even though the license doesn't strictly require it.
 */
export type PexelsPhoto = {
  id: number;
  width: number;
  height: number;
  photographer: string;
  photographer_url: string;
  alt: string;
  src: { large2x: string; large: string; medium: string; original: string };
};

export async function searchPexels(query: string, perPage = 15): Promise<PexelsPhoto[]> {
  if (!env.pexels.isConfigured) return [];
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`;
  const res = await fetch(url, {
    headers: { Authorization: env.pexels.apiKey! },
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    console.error('[pexels] search failed:', res.status);
    return [];
  }
  const data = (await res.json()) as { photos: PexelsPhoto[] };
  return data.photos ?? [];
}
