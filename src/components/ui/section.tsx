import { cn } from '@/lib/utils';

/**
 * Section — `.section` rhythm from the original: 5rem desktop padding,
 * collapsing to 3rem 1.5rem at the 768px breakpoint. `alt` applies `.section.alt`
 * (off-white background). `id` makes it a scrollspy target.
 */
export function Section({
  id,
  alt = false,
  className,
  children,
}: {
  id?: string;
  alt?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        'px-6 py-12 md:px-12 md:py-16 lg:px-20 lg:py-20',
        alt && 'bg-surface-off',
        className,
      )}
    >
      {children}
    </section>
  );
}

/**
 * SectionHeader — `.section-header`: `.sec-label` eyebrow, `.sec-title` with the
 * italic teal `<em>` word, and an optional `.section-sub`.
 */
export function SectionHeader({
  eyebrow,
  titleLead,
  titleEm,
  sub,
  className,
}: {
  eyebrow: string;
  titleLead: string;
  titleEm: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div className={cn('mb-12', className)}>
      <p className="mb-[0.6rem] text-[0.7rem] uppercase tracking-eyebrow text-teal">{eyebrow}</p>
      <h2 className="font-display text-sec-title font-bold leading-[1.2] text-ink">
        {titleLead}
        <em className="italic text-teal">{titleEm}</em>
      </h2>
      {sub && (
        <p className="mt-2 max-w-[520px] text-[0.88rem] leading-[1.7] text-ink-muted">{sub}</p>
      )}
    </div>
  );
}
