'use client';

import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Combobox — free-text input with a dropdown of existing options. The admin can
 * either pick an existing value (e.g. a category already used by another
 * project) or type a brand-new one. The visible input carries the form `name`,
 * so it submits like a normal text field.
 */
export function Combobox({
  name,
  options,
  defaultValue = '',
  placeholder,
  id,
}: {
  name: string;
  options: string[];
  defaultValue?: string;
  placeholder?: string;
  id?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const filtered = options
    .filter((o) => o.toLowerCase().includes(value.trim().toLowerCase()))
    .filter((o) => o.toLowerCase() !== value.trim().toLowerCase())
    .slice(0, 8);

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <input
          id={id}
          name={name}
          value={value}
          autoComplete="off"
          placeholder={placeholder}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          className={cn(
            'w-full rounded border border-line bg-surface-white px-3.5 py-2.5 pr-9 text-[0.85rem] text-ink',
            'transition-colors placeholder:text-ink-light focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20',
          )}
        />
        {options.length > 0 && (
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light"
            aria-hidden
          />
        )}
      </div>

      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-md border border-line bg-surface-white py-1 shadow-card">
          {filtered.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                // onMouseDown fires before input blur, so the pick registers.
                onMouseDown={(e) => {
                  e.preventDefault();
                  setValue(opt);
                  setOpen(false);
                }}
                className="block w-full px-3.5 py-1.5 text-left text-[0.83rem] text-ink-mid hover:bg-teal-ultra hover:text-teal"
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
