'use client';

import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';

/** Submit button that reflects the enclosing form's pending state. */
export function SubmitButton({ label = 'Enregistrer' }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded bg-teal px-6 py-2.5 text-[0.8rem] uppercase tracking-wide text-white transition-colors hover:bg-teal-dark disabled:opacity-60"
    >
      {pending ? 'Enregistrement…' : label}
    </button>
  );
}

export function FormActions({
  cancelHref,
  submitLabel,
}: {
  cancelHref: string;
  submitLabel?: string;
}) {
  return (
    <div className="flex items-center gap-3 border-t border-line pt-6">
      <SubmitButton label={submitLabel} />
      <Link href={cancelHref} className="text-[0.8rem] text-ink-muted hover:text-teal">
        Annuler
      </Link>
    </div>
  );
}

/** Labelled checkbox row for boolean fields (featured / visible). */
export function CheckboxRow({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 accent-[color:var(--teal)]"
      />
      <span>
        <span className="text-[0.85rem] text-ink">{label}</span>
        {hint && <span className="block text-[0.72rem] text-ink-muted">{hint}</span>}
      </span>
    </label>
  );
}

export function FormError({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  if (!children) return null;
  return (
    <p className={cn('rounded bg-red-50 px-3 py-2 text-[0.8rem] text-red-600', className)}>
      {children}
    </p>
  );
}
