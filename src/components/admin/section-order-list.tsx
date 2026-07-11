'use client';

import { useEffect, useState, useTransition } from 'react';
import { Eye, EyeOff, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import type { Section } from '@prisma/client';
import { cn } from '@/lib/utils';
import {
  toggleSectionVisibleAction,
  reorderSectionsAction,
} from '@/app/[adminBasePath]/(dashboard)/sections/actions';

/**
 * Section visibility + ordering. Reorder by dragging a row (grip handle) OR with
 * the up/down arrows. Drag updates local order optimistically and persists the
 * whole sequence on drop; arrows move one step. Both hit the DB and revalidate
 * the homepage, so changes are live without a redeploy.
 */
export function SectionOrderList({ sections }: { sections: Section[] }) {
  const [items, setItems] = useState(sections);
  const [dragId, setDragId] = useState<string | null>(null);
  const [pending, start] = useTransition();

  // Keep local state in sync if the server data changes (after persistence).
  useEffect(() => setItems(sections), [sections]);

  function persist(next: Section[]) {
    setItems(next);
    start(() => reorderSectionsAction(next.map((s) => s.id)).then(() => {}));
  }

  function moveArrow(index: number, dir: 'up' | 'down') {
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target]!, next[index]!];
    persist(next);
  }

  function onDragOver(overId: string) {
    if (!dragId || dragId === overId) return;
    const from = items.findIndex((s) => s.id === dragId);
    const to = items.findIndex((s) => s.id === overId);
    if (from === -1 || to === -1) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved!);
    setItems(next); // live preview; persisted on drop
  }

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface-white">
      <ul className="divide-y divide-line">
        {items.map((s, i) => (
          <li
            key={s.id}
            draggable
            onDragStart={() => setDragId(s.id)}
            onDragOver={(e) => {
              e.preventDefault();
              onDragOver(s.id);
            }}
            onDragEnd={() => {
              setDragId(null);
              persist(items);
            }}
            className={cn(
              'flex items-center gap-3 bg-surface-white px-4 py-3',
              dragId === s.id && 'opacity-50',
            )}
          >
            <span className="cursor-grab text-ink-light active:cursor-grabbing" aria-hidden>
              <GripVertical className="h-4 w-4" />
            </span>

            <div className="flex flex-col">
              <button
                aria-label="Monter"
                disabled={i === 0 || pending}
                onClick={() => moveArrow(i, 'up')}
                className="text-ink-light hover:text-teal disabled:opacity-30"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                aria-label="Descendre"
                disabled={i === items.length - 1 || pending}
                onClick={() => moveArrow(i, 'down')}
                className="text-ink-light hover:text-teal disabled:opacity-30"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>

            <span
              className={cn(
                'flex-1 text-[0.9rem]',
                s.visible ? 'text-ink' : 'text-ink-muted line-through',
              )}
            >
              {s.title}
            </span>

            <button
              aria-label={s.visible ? 'Masquer' : 'Afficher'}
              disabled={pending || s.key === 'hero'}
              title={s.key === 'hero' ? 'La section Hero reste toujours visible' : undefined}
              onClick={() => start(() => toggleSectionVisibleAction(s.id).then(() => {}))}
              className={cn(s.visible ? 'text-teal' : 'text-ink-light', 'disabled:opacity-30')}
            >
              {s.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
