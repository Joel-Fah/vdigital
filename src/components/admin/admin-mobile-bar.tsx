'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, LogOut, ExternalLink } from 'lucide-react';
import { AdminNav } from '@/components/admin/admin-nav';

/**
 * Dashboard mobile navigation (< lg). A top bar with the wordmark + hamburger
 * opening a full-screen drawer that reuses the grouped AdminNav, mirroring the
 * public site's mobile experience. Page scroll is locked while open.
 *
 * `logout` is the server sign-out action, passed down from the layout.
 */
export function AdminMobileBar({
  base,
  email,
  logout,
}: {
  base: string;
  email?: string | null;
  logout: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between rounded-lg border border-line bg-surface-white px-4 py-3">
        <Link href={base} className="font-display text-[1.15rem] font-bold text-ink">
          V<span className="text-teal">DIGITAL</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          className="rounded p-1.5 text-ink hover:text-teal"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-surface-white">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <span className="font-display text-[1.2rem] font-bold text-ink">
              V<span className="text-teal">DIGITAL</span>
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
              className="rounded p-1.5 text-ink hover:text-teal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5">
            <AdminNav base={base} onNavigate={() => setOpen(false)} />
          </div>

          <div className="border-t border-line px-4 py-4">
            {email && <p className="mb-2 px-3 text-[0.72rem] text-ink-muted">{email}</p>}
            <Link
              href="/"
              target="_blank"
              onClick={() => setOpen(false)}
              className="mb-1 flex items-center gap-2 px-3 py-1.5 text-[0.8rem] text-ink-muted hover:text-teal"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Voir le site
            </Link>
            <form action={logout}>
              <button className="flex w-full items-center gap-2 px-3 py-1.5 text-[0.8rem] text-ink-muted hover:text-red-600">
                <LogOut className="h-3.5 w-3.5" /> Déconnexion
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
