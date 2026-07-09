'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Drawer } from '@/components/ui/drawer';
import { ProjectDrawerContent } from './project-drawer-content';
import { ServiceDrawerContent } from './service-drawer-content';
import { OfferDrawerContent } from './offer-drawer-content';

type DetailType = 'project' | 'service' | 'offer';
const PARAMS: Record<DetailType, string> = {
  project: 'project',
  service: 'service',
  offer: 'offer',
};

/**
 * DetailDrawer (Section 5.3) — mounted once in the public layout so it works
 * from every entry point (homepage teasers, /projects, /services).
 *
 * The open state is derived from a shallow query param (?project= / ?service= /
 * ?offer=), so the drawer is shareable, survives refresh, and closes on browser
 * back. Closing strips the param via router.replace with scroll disabled, which
 * preserves the scroll position underneath.
 */
export function DetailDrawer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const active = (Object.keys(PARAMS) as DetailType[]).find((t) => searchParams.get(PARAMS[t]));
  const slug = active ? searchParams.get(PARAMS[active]) : null;

  const [content, setContent] = useState<{ type: DetailType; data: unknown } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!active || !slug) return;
    let cancelled = false;
    setLoading(true);
    setContent(null);
    fetch(`/api/detail?type=${active}&slug=${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!cancelled) setContent(json);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [active, slug]);

  const close = useCallback(() => {
    // Preserve any non-drawer query params; only strip the drawer ones.
    const params = new URLSearchParams(searchParams.toString());
    Object.values(PARAMS).forEach((p) => params.delete(p));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [router, pathname, searchParams]);

  const title = content && content.type ? getTitle(content) : loading ? 'Chargement…' : 'Détail';

  return (
    <Drawer open={Boolean(active && slug)} onOpenChange={(o) => !o && close()} title={title}>
      {loading && <DrawerSkeleton />}
      {!loading && content?.type === 'project' && <ProjectDrawerContent data={content.data} />}
      {!loading && content?.type === 'service' && <ServiceDrawerContent data={content.data} />}
      {!loading && content?.type === 'offer' && <OfferDrawerContent data={content.data} />}
      {!loading && !content && (
        <p className="text-[0.85rem] text-ink-muted">
          Ce contenu est introuvable ou n'est plus disponible.
        </p>
      )}
    </Drawer>
  );
}

function getTitle(content: { type: DetailType; data: unknown }): string {
  const d = content.data as { title?: string; name?: string };
  return d?.title ?? d?.name ?? 'Détail';
}

function DrawerSkeleton() {
  return (
    <div className="space-y-4">
      <div className="skeleton h-40 w-full rounded-md" />
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-5/6 rounded" />
    </div>
  );
}
