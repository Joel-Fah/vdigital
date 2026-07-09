import { cn } from '@/lib/utils';

/** TagPill — the `.stag` / `.cl-tag` uppercase micro-pill. */
export function TagPill({
  children,
  tone = 'teal',
  className,
}: {
  children: React.ReactNode;
  tone?: 'teal' | 'gold' | 'muted';
  className?: string;
}) {
  const tones = {
    teal: 'border-teal/20 text-teal',
    gold: 'border-gold/30 bg-gold/10 text-gold',
    muted: 'border-line text-ink-muted',
  } as const;
  return (
    <span
      className={cn(
        'inline-block rounded-sm border px-[9px] py-[3px] text-[0.62rem] uppercase tracking-[0.8px]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
