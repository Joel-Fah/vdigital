'use client';

import { useState, useId } from 'react';
import { HelpCircle } from 'lucide-react';

/**
 * HelpTip — a small "?" affordance that reveals extra guidance on hover/focus
 * (and tap). Accessible: the popover is linked via aria-describedby and is
 * reachable by keyboard. Used for complex fields (e.g. "Résumé / mission").
 */
export function HelpTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label="Aide"
        aria-describedby={open ? id : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        className="text-ink-light transition-colors hover:text-teal focus-visible:text-teal focus-visible:outline-none"
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-50 mb-1.5 w-56 -translate-x-1/2 rounded-md border border-line bg-ink px-3 py-2 text-[0.72rem] normal-case leading-relaxed tracking-normal text-white shadow-card"
        >
          {text}
        </span>
      )}
    </span>
  );
}
