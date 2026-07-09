import Link from 'next/link';
import { LogOut, ExternalLink } from 'lucide-react';
import { requireAdmin, adminPath } from '@/lib/admin';
import { signOut } from '@/lib/auth';
import { AdminNav } from '@/components/admin/admin-nav';

export const metadata = { robots: { index: false, follow: false } };

/**
 * Dashboard shell (Section 3 / Phase 5). Server-guarded, with sidebar nav and a
 * header showing the signed-in admin + logout. All child pages inherit the guard.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const base = adminPath();

  return (
    <div className="min-h-screen bg-surface-off">
      <div className="mx-auto flex max-w-[1400px] gap-8 px-4 py-6 lg:px-8">
        {/* Sidebar */}
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-56 flex-shrink-0 flex-col rounded-lg border border-line bg-surface-white p-4 lg:flex">
          <Link href={base} className="mb-6 px-3 font-display text-[1.2rem] font-bold text-ink">
            V<span className="text-teal">DIGITAL</span>
          </Link>
          <AdminNav base={base} />
          <div className="mt-auto border-t border-line pt-4">
            <Link
              href="/"
              target="_blank"
              className="mb-2 flex items-center gap-2 px-3 py-1.5 text-[0.78rem] text-ink-muted hover:text-teal"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Voir le site
            </Link>
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: adminPath() });
              }}
            >
              <button className="flex w-full items-center gap-2 px-3 py-1.5 text-[0.78rem] text-ink-muted hover:text-red-600">
                <LogOut className="h-3.5 w-3.5" /> Déconnexion
              </button>
            </form>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          <header className="mb-6 flex items-center justify-between">
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
