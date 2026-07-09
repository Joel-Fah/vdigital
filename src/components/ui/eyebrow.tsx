import { cn } from '@/lib/utils';

/**
 * Eyebrow — small uppercase label (original `.sec-label` / `.hero-tag`).
 * `dot` renders the leading dot used by hero-style tags; `boxed` renders the
 * pill-with-border treatment.
 */
export function Eyebrow({
  children,
  className,
  dot = false,
  boxed = false,
  as: Tag = 'p',
}: {
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
  boxed?: boolean;
  as?: 'p' | 'span' | 'div';
}) {
  return (
    <Tag
      className={cn(
        'text-eyebrow uppercase text-teal',
        boxed &&
          'inline-flex items-center gap-2 rounded border border-teal/20 bg-teal-ultra px-4 py-1.5',
        dot && 'inline-flex items-center gap-2',
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-teal-bright" aria-hidden />}
      {children}
    </Tag>
  );
}
