import { cn } from '@/lib/utils';

/**
 * StatBlock — reusable numeric-highlight block (Section 2.4).
 * Powers hero stats bar, about mini-stats, case-study KPIs, client KPIs.
 * `value` may include a trailing "+" which is rendered as a superscript,
 * matching the original `<sup>` treatment.
 */
export function StatBlock({
  value,
  label,
  trend,
  size = 'md',
  className,
}: {
  value: string;
  label: string;
  trend?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const match = value.match(/^(.*?)(\+)?$/);
  const main = match?.[1] ?? value;
  const sup = match?.[2];

  const valueSize = {
    sm: 'text-[1.3rem]',
    md: 'text-[1.4rem]',
    lg: 'text-[2rem]',
  }[size];

  return (
    <div className={cn('text-center', className)}>
      <div className={cn('font-display font-bold leading-none text-teal', valueSize)}>
        {main}
        {sup && <sup className="text-[0.7em]">{sup}</sup>}
      </div>
      <div className="mt-1 text-[0.62rem] uppercase tracking-wide text-ink-muted">{label}</div>
      {trend && <div className="mt-0.5 text-[0.62rem] text-green-700">{trend}</div>}
    </div>
  );
}
