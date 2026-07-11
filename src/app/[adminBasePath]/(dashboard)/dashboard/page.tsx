import Link from 'next/link';
import { adminPath } from '@/lib/admin';
import { getDashboardStats } from '@/lib/dashboard-stats';
import { DashboardCharts } from '@/components/admin/dashboard-charts';

export const dynamic = 'force-dynamic';

/** Admin overview — KPI tiles + charts bento (content mix + activity). */
export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const t = stats.totals;

  const cards = [
    { label: 'Projets', value: t.projects, sub: 'projects' },
    { label: 'Services', value: t.services, sub: 'services' },
    { label: 'Clients', value: t.clients, sub: 'clients' },
    { label: 'Expertise', value: t.expertise, sub: 'expertise' },
    { label: 'Offres', value: t.offers, sub: 'offers' },
    { label: 'Témoignages', value: t.testimonials, sub: 'testimonials' },
    { label: 'Messages non lus', value: t.unread, sub: 'messages', highlight: t.unread > 0 },
    { label: 'Médias', value: t.media, sub: 'media' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-1 font-display text-[1.6rem] font-bold text-ink">Tableau de bord</h1>
        <p className="text-[0.85rem] text-ink-muted">
          Vue d&apos;ensemble du contenu. Tout est modifiable ici, sans redéploiement.
        </p>
      </div>

      {/* KPI tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.sub}
            href={adminPath(c.sub)}
            className={`rounded-lg border p-5 transition-colors hover:border-teal/40 ${
              c.highlight ? 'border-gold/40 bg-gold/5' : 'border-line bg-surface-white'
            }`}
          >
            <div className="font-display text-[2rem] font-bold text-teal">{c.value}</div>
            <div className="mt-1 text-[0.8rem] text-ink-muted">{c.label}</div>
          </Link>
        ))}
      </div>

      {/* Charts bento */}
      <DashboardCharts stats={stats} />
    </div>
  );
}
