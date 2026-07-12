import Link from 'next/link';
import { LogOut, ExternalLink } from 'lucide-react';
import { requireAdmin, adminPath } from '@/lib/admin';
import { signOut } from '@/lib/auth';
import { AdminNavGroups, AdminNavLink, TOP_ITEM } from '@/components/admin/admin-nav';
import { ScrollArea } from '@/components/admin/scroll-area';
import { AdminMobileBar } from '@/components/admin/admin-mobile-bar';

export const metadata = { robots: { index: false, follow: false } };

/**
 * Dashboard shell (Section 3 / Phase 5). Server-guarded. Sidebar on lg+, a
 * full-screen mobile drawer below that. All child pages inherit the guard.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const base = adminPath();

  async function logout() {
    'use server';
    await signOut({ redirectTo: adminPath() });
  }

  return (
    <div className="min-h-screen bg-surface-off">
      {/* Mobile top bar + drawer (< lg) */}
      <div className="px-4 py-4 lg:hidden">
        <AdminMobileBar base={base} email={session.user.email} logout={logout} />
      </div>

      <div className="mx-auto flex max-w-[1400px] gap-8 px-4 pb-6 lg:px-8 lg:py-6">
        {/* Sidebar — fixed brand + Tableau de bord on top, scrollable groups in
            the middle, fixed "Voir le site / Déconnexion" at the bottom, so it
            works at any viewport height. */}
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-56 flex-shrink-0 flex-col overflow-hidden rounded-lg border border-line bg-surface-white lg:flex">
          <div className="flex-shrink-0 p-4 pb-2">
            <Link
              href={base}
              className="mb-4 block px-3 font-display text-[1.2rem] font-bold text-ink"
            >
              V<span className="text-teal">DIGITAL</span>
            </Link>
            <AdminNavLink base={base} item={TOP_ITEM} />
          </div>

          <ScrollArea className="min-h-0 flex-1 px-4 py-2">
            <AdminNavGroups base={base} />
          </ScrollArea>

          <div className="flex-shrink-0 border-t border-line p-4">
            <Link
              href="/"
              target="_blank"
              className="mb-1 flex items-center gap-2 px-3 py-1.5 text-[0.78rem] text-ink-muted hover:text-teal"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Voir le site
            </Link>
            <form action={logout}>
              <button className="flex w-full items-center gap-2 px-3 py-1.5 text-[0.78rem] text-ink-muted hover:text-red-600">
                <LogOut className="h-3.5 w-3.5" /> Déconnexion
              </button>
            </form>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          <header className="mb-6 hidden items-center justify-between lg:flex">
            <p className="text-[0.8rem] text-ink-muted">
              Connecté en tant que <span className="text-ink">{session.user.email}</span>
            </p>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
