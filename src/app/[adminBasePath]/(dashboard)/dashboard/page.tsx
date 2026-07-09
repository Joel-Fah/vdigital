import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { adminPath } from '@/lib/admin';

export const dynamic = 'force-dynamic';

/** Admin overview — content counts + unread messages, each a quick link. */
export default async function DashboardPage() {
  const [projects, services, clients, expertise, offers, testimonials, unread, media] =
    await Promise.all([
      prisma.project.count(),
      prisma.service.count(),
      prisma.clientLogo.count(),
      prisma.expertiseItem.count(),
      prisma.offer.count(),
      prisma.testimonial.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.mediaAsset.count(),
    ]);

  const cards = [
    { label: 'Projets', value: projects, sub: 'projects' },
    { label: 'Services', value: services, sub: 'services' },
    { label: 'Clients', value: clients, sub: 'clients' },
    { label: 'Expertise', value: expertise, sub: 'expertise' },
    { label: 'Offres', value: offers, sub: 'offers' },
    { label: 'Témoignages', value: testimonials, sub: 'testimonials' },
    { label: 'Messages non lus', value: unread, sub: 'messages', highlight: unread > 0 },
    { label: 'Médias', value: media, sub: 'media' },
  ];

  return (
    <div>
      <h1 className="mb-1 font-display text-[1.6rem] font-bold text-ink">Tableau de bord</h1>
      <p className="mb-8 text-[0.85rem] text-ink-muted">
        Vue d'ensemble du contenu. Tout est modifiable ici, sans redéploiement.
      </p>

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
    </div>
  );
}
