'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useInfinite — cursor-based progressive loading (Section 5.1).
 * Observes a sentinel ref; on intersect, fetches the next page from `endpoint`
 * and appends. Guards against duplicate in-flight requests.
 */
export function useInfinite<T extends { id: string }>({
  endpoint,
  initialItems,
  initialCursor,
}: {
  endpoint: string;
  initialItems: T[];
  initialCursor: string | null;
}) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || cursor === null) return;
    loadingRef.current = true;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`${endpoint}?cursor=${encodeURIComponent(cursor)}`);
      if (!res.ok) throw new Error('fetch failed');
      const page: { items: T[]; nextCursor: string | null } = await res.json();
      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...page.items.filter((i) => !seen.has(i.id))];
      });
      setCursor(page.nextCursor);
    } catch {
      setError(true);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [cursor, endpoint]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || cursor === null) return;
    const observer = new IntersectionObserver(
      (entries) => entries[0]?.isIntersecting && loadMore(),
      { rootMargin: '400px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore, cursor]);

  return { items, cursor, loading, error, sentinel, loadMore, hasMore: cursor !== null };
}
