import { cn } from '@/lib/utils';

/**
 * RichText — renders stored rich-text HTML. The content is sanitized on write
 * (src/lib/html.ts), so it is safe to inject here without re-sanitizing. Styled
 * via the `.prose-vd` rules in globals.css.
 */
export function RichText({ html, className }: { html: string; className?: string }) {
  return <div className={cn('prose-vd', className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
