import { cn } from '@/lib/utils';

/**
 * EmptyState — designed empty state for every dynamic list (Section 6).
 * Public variant: calm, forward-looking. Admin variant: action-oriented,
 * dashed border, offers the next step. Never a bare "0 results".
 */
export function EmptyState({
  icon,
  message,
  action,
  variant = 'public',
  className,
}: {
  icon?: React.ReactNode;
  message: string;
  action?: React.ReactNode;
  variant?: 'public' | 'admin' | 'chip';
  className?: string;
}) {
  if (variant === 'chip') {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded border border-dashed border-line px-4 py-3 text-[0.8rem] text-ink-muted',
          className,
        )}
      >
        {icon && <span className="mr-2 text-teal/60">{icon}</span>}
        {message}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-lg px-6 py-14 text-center',
        variant === 'admin' ? 'border border-dashed border-line bg-surface-off' : 'bg-teal-ultra',
        className,
      )}
    >
      {icon && <div className="text-teal/60">{icon}</div>}
      <p className="max-w-md text-[0.9rem] leading-relaxed text-ink-mid">{message}</p>
      {action}
    </div>
  );
}
