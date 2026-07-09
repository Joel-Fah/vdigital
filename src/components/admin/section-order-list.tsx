'use client';

import { useTransition } from 'react';
import { Eye, EyeOff, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import type { Section } from '@prisma/client';
import {
  toggleSectionVisibleAction,
  reorderSectionAction,
} from '@/app/[adminBasePath]/(dashboard)/sections/actions';

/**
 * Section visibility + ordering (Definition of Done: reordering without a
 * redeploy). Up/down reorder + visibility toggle, persisted to the DB and
 * reflected on the homepage via revalidation.
 */
export function SectionOrderList({ sections }: { sections: Section[] }) {
  const [pending, start] = useTransition();

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface-white">
      <ul className="divide-y divide-line">
        {sections.map((s, i) => (
          <li key={s.id} className="flex items-center gap-3 px-4 py-3">
            <GripVertical className="h-4 w-4 text-ink-light" />
            <div className="flex flex-col">
              <button
                aria-label="Monter"
                disabled={i === 0 || pending}
                onClick={() => start(() => reorderSectionAction(s.id, 'up').then(() => {}))}
                className="text-ink-light hover:text-teal disabled:opacity-30"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                aria-label="Descendre"
                disabled={i === sections.length - 1 || pending}
                onClick={() => start(() => reorderSectionAction(s.id, 'down').then(() => {}))}
                className="text-ink-light hover:text-teal disabled:opacity-30"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
            <span
              className={`flex-1 text-[0.9rem] ${s.visible ? 'text-ink' : 'text-ink-muted line-through'}`}
            >
              {s.title}
            </span>
            <button
              aria-label={s.visible ? 'Masquer' : 'Afficher'}
              disabled={pending || s.key === 'hero'}
              title={s.key === 'hero' ? 'La section Hero reste toujours visible' : undefined}
              onClick={() => start(() => toggleSectionVisibleAction(s.id).then(() => {}))}
              className={`${s.visible ? 'text-teal' : 'text-ink-light'} disabled:opacity-30`}
            >
              {s.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
