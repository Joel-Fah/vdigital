'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { MediaAsset, Testimonial } from '@prisma/client';
import { Drawer } from '@/components/ui/drawer';
import { TestimonialCard } from '@/components/cards/testimonial-card';

type TestimonialWithPhoto = Testimonial & { photo: MediaAsset | null };

/**
 * TestimonialsPanel — side-panel drawer listing ALL testimonials, opened via the
 * shallow `?temoignages=1` param (v1.2), mirroring the project drawer pattern:
 * shareable URL, browser-back closes it. Mounted once in the public layout.
 */
export function TestimonialsPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const open = searchParams.get('temoignages') === '1';

  const [items, setItems] = useState<TestimonialWithPhoto[] | null>(null);

  useEffect(() => {
    if (!open || items) return;
    fetch('/api/testimonials')
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((json) => setItems(json.items ?? []))
      .catch(() => setItems([]));
  }, [open, items]);

  const close = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('temoignages');
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [router, pathname, searchParams]);

  return (
    <Drawer open={open} onOpenChange={(o) => !o && close()} title="Témoignages">
      {items === null ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-32 w-full rounded-lg" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-[0.85rem] text-ink-muted">Aucun témoignage pour le moment.</p>
      ) : (
        <div className="space-y-5">
          {items.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      )}
    </Drawer>
  );
}
