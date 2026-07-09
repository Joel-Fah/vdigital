'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { Eye, EyeOff, Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import {
  deleteEntityAction,
  toggleVisibleAction,
  reorderEntityAction,
  type EntityModel,
} from '@/app/[adminBasePath]/(dashboard)/actions';

export type ResourceRow = {
  id: string;
  primary: string;
  secondary?: string;
  visible: boolean;
};

/**
 * Reusable admin list (Section 6 admin empty state). Row actions — reorder,
 * toggle visibility, edit, delete — call the shared generic server actions
 * bound to this list's `model`. Delete asks for confirmation.
 */
export function ResourceList({
  model,
  rows,
  editHrefBase,
  addHref,
}: {
  model: EntityModel;
  rows: ResourceRow[];
  editHrefBase: string;
  addHref: string;
}) {
  const [pending, start] = useTransition();

  if (rows.length === 0) {
    return (
      <EmptyState
        variant="admin"
        message="Nothing here yet — click '+ Ajouter' to create the first one."
        action={
          <Link href={addHref} className="text-[0.8rem] font-medium text-teal hover:underline">
            + Ajouter
          </Link>
        }
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface-white">
      <ul className="divide-y divide-line">
        {rows.map((row, i) => (
          <li key={row.id} className="flex items-center gap-3 px-4 py-3">
            <div className="flex flex-col">
              <button
                aria-label="Monter"
                disabled={i === 0 || pending}
                onClick={() => start(() => reorderEntityAction(model, row.id, 'up').then(() => {}))}
                className="text-ink-light hover:text-teal disabled:opacity-30"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                aria-label="Descendre"
                disabled={i === rows.length - 1 || pending}
                onClick={() =>
                  start(() => reorderEntityAction(model, row.id, 'down').then(() => {}))
                }
                className="text-ink-light hover:text-teal disabled:opacity-30"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={`truncate text-[0.9rem] font-medium ${row.visible ? 'text-ink' : 'text-ink-muted line-through'}`}
              >
                {row.primary}
              </p>
              {row.secondary && (
                <p className="truncate text-[0.75rem] text-ink-muted">{row.secondary}</p>
              )}
            </div>

            <button
              aria-label={row.visible ? 'Masquer' : 'Afficher'}
              title={
                row.visible ? 'Visible — cliquer pour masquer' : 'Masqué — cliquer pour afficher'
              }
              disabled={pending}
              onClick={() => start(() => toggleVisibleAction(model, row.id).then(() => {}))}
              className={row.visible ? 'text-teal' : 'text-ink-light'}
            >
              {row.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>

            <Link
              href={`${editHrefBase}/${row.id}`}
              aria-label="Modifier"
              className="text-ink-muted hover:text-teal"
            >
              <Pencil className="h-4 w-4" />
            </Link>

            <button
              aria-label="Supprimer"
              disabled={pending}
              onClick={() => {
                if (confirm(`Supprimer « ${row.primary} » ?`))
                  start(() => deleteEntityAction(model, row.id).then(() => {}));
              }}
              className="text-ink-muted hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
