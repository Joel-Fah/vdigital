import 'server-only';
import { prisma } from '@/lib/prisma';

export type DashboardStats = {
  totals: {
    projects: number;
    services: number;
    clients: number;
    expertise: number;
    offers: number;
    testimonials: number;
    media: number;
    unread: number;
  };
  featured: { projects: number; services: number; testimonials: number };
  pexelsCount: number;
  messages30d: number;
  contentBreakdown: { label: string; value: number }[];
  messagesByDay: { date: string; count: number }[];
  mediaBySource: { upload: number; pexels: number };
  recentMessages: {
    id: string;
    name: string;
    subject: string | null;
    createdAt: Date;
    read: boolean;
  }[];
};

const DAYS = 30;

/** All numbers for the dashboard overview in one round-trip (client retries cold-starts). */
export async function getDashboardStats(): Promise<DashboardStats> {
  const since = new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000);
  since.setHours(0, 0, 0, 0);

  const [
    projects,
    services,
    clients,
    expertise,
    offers,
    testimonials,
    media,
    unread,
    uploadMedia,
    pexelsMedia,
    recentMsgRows,
    windowMsgs,
    featProjects,
    featServices,
    featTestimonials,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.service.count(),
    prisma.clientLogo.count(),
    prisma.expertiseItem.count(),
    prisma.offer.count(),
    prisma.testimonial.count(),
    prisma.mediaAsset.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.mediaAsset.count({ where: { source: 'upload' } }),
    prisma.mediaAsset.count({ where: { source: 'pexels' } }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: { id: true, name: true, subject: true, createdAt: true, read: true },
    }),
    prisma.contactMessage.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    }),
    prisma.project.count({ where: { featured: true } }),
    prisma.service.count({ where: { featured: true } }),
    prisma.testimonial.count({ where: { featured: true } }),
  ]);

  // Bucket messages into daily counts across the whole window (zero-filled).
  const buckets = new Map<string, number>();
  for (let i = 0; i < DAYS; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const m of windowMsgs) {
    const key = m.createdAt.toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return {
    totals: { projects, services, clients, expertise, offers, testimonials, media, unread },
    featured: { projects: featProjects, services: featServices, testimonials: featTestimonials },
    pexelsCount: pexelsMedia,
    messages30d: windowMsgs.length,
    contentBreakdown: [
      { label: 'Projets', value: projects },
      { label: 'Services', value: services },
      { label: 'Clients', value: clients },
      { label: 'Expertise', value: expertise },
      { label: 'Offres', value: offers },
      { label: 'Témoignages', value: testimonials },
    ],
    messagesByDay: Array.from(buckets, ([date, count]) => ({ date, count })),
    mediaBySource: { upload: uploadMedia, pexels: pexelsMedia },
    recentMessages: recentMsgRows,
  };
}
