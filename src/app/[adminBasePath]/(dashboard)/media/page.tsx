import { prisma } from '@/lib/prisma';
import { env } from '@/lib/env';
import { MediaManager } from '@/components/admin/media-manager';

export const dynamic = 'force-dynamic';

export default async function MediaPage() {
  const assets = await prisma.mediaAsset.findMany({ orderBy: { uploadedAt: 'desc' }, take: 200 });
  return (
    <div>
      <h1 className="mb-1 font-display text-[1.6rem] font-bold text-ink">Médiathèque</h1>
      <p className="mb-8 text-[0.85rem] text-ink-muted">
        Images téléversées et visuels Pexels provisoires.
      </p>
      {/* Pexels picker is always available now — curated static URLs, no API key. */}
      <MediaManager assets={assets} r2Enabled={env.r2.isConfigured} pexelsEnabled />
    </div>
  );
}
