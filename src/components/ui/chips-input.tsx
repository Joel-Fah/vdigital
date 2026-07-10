'use client';

import { useState, useRef, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * ChipsInput — GitHub-style tag field. Each entry becomes a removable chip
 * inside the field. Adds on Enter or comma; Backspace on an empty input removes
 * the last chip. Submits a hidden comma-joined input so it plugs into a plain
 * <form> and the existing `parseList(..., 'comma')` server parsing unchanged.
 */
export function ChipsInput({
  name,
  defaultValue = [],
  placeholder = 'Ajouter…',
  max = 20,
}: {
  name: string;
  defaultValue?: string[];
  placeholder?: string;
  max?: number;
}) {
  const [chips, setChips] = useState<string[]>(defaultValue);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function add(raw: string) {
    const value = raw.trim().replace(/,$/, '').trim();
    if (!value) return;
    if (chips.length >= max) return;
    // Case-insensitive de-dupe.
    if (chips.some((c) => c.toLowerCase() === value.toLowerCase())) {
      setDraft('');
      return;
    }
    setChips([...chips, value]);
    setDraft('');
  }

  function remove(i: number) {
    setChips(chips.filter((_, idx) => idx !== i));
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add(draft);
    } else if (e.key === 'Backspace' && draft === '' && chips.length) {
      remove(chips.length - 1);
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={cn(
        'flex min-h-[42px] w-full flex-wrap items-center gap-1.5 rounded border border-line bg-surface-white px-2 py-1.5',
        'cursor-text transition-colors focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/20',
      )}
    >
      {/* Hidden field the form submits (comma-joined). */}
      <input type="hidden" name={name} value={chips.join(',')} />

      {chips.map((chip, i) => (
        <span
          key={`${chip}-${i}`}
          className="inline-flex items-center gap-1 rounded-sm border border-teal/20 bg-teal-ultra px-2 py-0.5 text-[0.72rem] text-teal"
        >
          {chip}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              remove(i);
            }}
            className="rounded-sm text-teal/60 hover:text-teal"
            aria-label={`Retirer ${chip}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => add(draft)}
        placeholder={chips.length === 0 ? placeholder : ''}
        className="min-w-[100px] flex-1 bg-transparent px-1 py-0.5 text-[0.85rem] text-ink outline-none placeholder:text-ink-light"
      />
    </div>
  );
}
