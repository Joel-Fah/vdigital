import Link from 'next/link';
import { Plus } from 'lucide-react';

export function AdminHeader({
  title,
  subtitle,
  addHref,
  addLabel = 'Ajouter',
}: {
  title: string;
  subtitle?: string;
  addHref?: string;
  addLabel?: string;
}) {
  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-[1.6rem] font-bold text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-[0.85rem] text-ink-muted">{subtitle}</p>}
      </div>
      {addHref && (
        <Link
          href={addHref}
          className="inline-flex flex-shrink-0 items-center gap-2 rounded bg-teal px-4 py-2 text-[0.78rem] uppercase tracking-wide text-white transition-colors hover:bg-teal-dark"
        >
          <Plus className="h-4 w-4" /> {addLabel}
        </Link>
      )}
    </div>
  );
}
