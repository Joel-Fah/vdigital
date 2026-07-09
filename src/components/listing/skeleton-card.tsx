/** Skeleton placeholders matching real card dimensions to avoid layout shift (Section 5.1). */

export function ProjectSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface-white">
      <div className="flex items-center gap-6 border-b border-line bg-teal-ultra px-6 py-5">
        <div className="skeleton h-9 w-11 rounded" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-1/2 rounded" />
          <div className="skeleton h-3 w-1/3 rounded" />
        </div>
      </div>
      <div className="space-y-3 p-6">
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-5/6 rounded" />
        <div className="skeleton h-16 w-full rounded-md" />
      </div>
    </div>
  );
}

export function ServiceSkeleton() {
  return (
    <div className="space-y-3 bg-surface-white p-10">
      <div className="skeleton h-11 w-11 rounded-md" />
      <div className="skeleton h-4 w-1/2 rounded" />
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-4/5 rounded" />
    </div>
  );
}
