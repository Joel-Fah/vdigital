'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * ScrollArea — a scroll container whose thin scrollbar appears while scrolling
 * (and on hover) and fades out shortly after. Pure enhancement; the content is
 * always scrollable via wheel/touch/keys regardless.
 */
export function ScrollArea({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function onScroll() {
    const el = ref.current;
    if (!el) return;
    el.classList.add('is-scrolling');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => el.classList.remove('is-scrolling'), 900);
  }

  return (
    <div ref={ref} onScroll={onScroll} className={cn('scroll-fade overflow-y-auto', className)}>
      {children}
    </div>
  );
}
