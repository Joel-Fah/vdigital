'use client';

import type { MediaAsset, Project } from '@prisma/client';
import { FolderOpen } from 'lucide-react';
import { ProjectCard } from '@/components/cards/project-card';
import { ProjectSkeleton } from './skeleton-card';
import { EmptyState } from '@/components/ui/empty-state';
import { EndOfList } from './end-of-list';
import { useInfinite } from './use-infinite';

type ProjectWithCover = Project & { coverImage: MediaAsset | null };

/**
 * Progressive projects list (Section 5.1). If empty on first load → the designed
 * empty state (with an admin-only "add first" affordance handled server-side).
 */
export function ProjectsList({
  initialItems,
  initialCursor,
  adminAddHref,
}: {
  initialItems: ProjectWithCover[];
  initialCursor: string | null;
  adminAddHref?: string;
}) {
  const { items, loading, error, sentinel, hasMore, loadMore } = useInfinite<ProjectWithCover>({
    endpoint: '/api/projects',
    initialItems,
    initialCursor,
  });

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<FolderOpen className="h-8 w-8" strokeWidth={1.25} />}
        message="No projects published yet."
        action={
          adminAddHref ? (
            <a href={adminAddHref} className="text-[0.8rem] font-medium text-teal hover:underline">
              Add your first project →
            </a>
          ) : undefined
        }
      />
    );
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        {items.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>

      {loading && (
        <div className="mt-8 flex flex-col gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProjectSkeleton key={i} />
          ))}
        </div>
      )}

      <div ref={sentinel} aria-hidden />
      <EndOfList hasMore={hasMore} error={error} onRetry={loadMore} />
    </>
  );
}
