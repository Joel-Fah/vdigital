'use client';

import type { MediaAsset, Service } from '@prisma/client';
import { PenTool } from 'lucide-react';
import { ServiceCard } from '@/components/cards/service-card';
import { ServiceSkeleton } from './skeleton-card';
import { EmptyState } from '@/components/ui/empty-state';
import { EndOfList } from './end-of-list';
import { useInfinite } from './use-infinite';

type ServiceWithIcon = Service & { icon: MediaAsset | null };

/** Progressive services list (Section 5.1). */
export function ServicesList({
  initialItems,
  initialCursor,
}: {
  initialItems: ServiceWithIcon[];
  initialCursor: string | null;
}) {
  const { items, loading, error, sentinel, hasMore, loadMore } = useInfinite<ServiceWithIcon>({
    endpoint: '/api/services',
    initialItems,
    initialCursor,
  });

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<PenTool className="h-8 w-8" strokeWidth={1.25} />}
        message="No services published yet. New offerings will appear here as soon as they're ready."
      />
    );
  }

  return (
    <>
      <div className="grid-lines grid overflow-hidden rounded-lg border border-line sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
        {loading && Array.from({ length: 3 }).map((_, i) => <ServiceSkeleton key={`sk-${i}`} />)}
      </div>

      <div ref={sentinel} aria-hidden />
      <EndOfList hasMore={hasMore} error={error} onRetry={loadMore} />
    </>
  );
}
