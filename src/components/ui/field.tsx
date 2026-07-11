import * as React from 'react';
import { cn } from '@/lib/utils';
import { HelpTip } from '@/components/ui/help-tip';

/** Shared form field primitives — used by the contact form and all admin forms. */

const inputBase =
  'w-full rounded border border-line bg-surface-white px-3.5 py-2.5 text-[0.85rem] text-ink ' +
  'transition-colors placeholder:text-ink-light focus:border-teal focus:outline-none ' +
  'focus:ring-2 focus:ring-teal/20 disabled:opacity-60';

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn(inputBase, className)} {...props} />;
});

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  // `field-sizing:content` grows the textarea with its content in supporting
  // browsers; `resize-y` + min-height is the fallback elsewhere.
  return (
    <textarea
      ref={ref}
      className={cn(inputBase, 'min-h-28 resize-y [field-sizing:content]', className)}
      {...props}
    />
  );
});

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, ...props }, ref) {
  return <select ref={ref} className={cn(inputBase, className)} {...props} />;
});

export function Label({
  children,
  htmlFor,
  required,
  className,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('mb-1.5 block text-[0.72rem] uppercase tracking-wide text-ink-mid', className)}
    >
      {children}
      {required && (
        <span className="ml-0.5 text-red-500" aria-hidden>
          *
        </span>
      )}
    </label>
  );
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="mt-1 text-[0.72rem] text-red-600">{children}</p>;
}

export function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  tooltip,
  children,
}: {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  /** Extra guidance shown via a "?" popover next to the label (complex fields). */
  tooltip?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {label && (
        <div className="mb-1.5 flex items-center gap-1.5">
          <Label htmlFor={htmlFor} required={required} className="mb-0">
            {label}
          </Label>
          {tooltip && <HelpTip text={tooltip} />}
        </div>
      )}
      {children}
      {hint && !error && <p className="mt-1 text-[0.72rem] text-ink-muted">{hint}</p>}
      <FieldError>{error}</FieldError>
    </div>
  );
}
