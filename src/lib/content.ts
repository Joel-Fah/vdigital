import 'server-only';
import { prisma } from '@/lib/prisma';
import { withRetry } from '@/lib/db-retry';

/**
 * Public content queries. All read paths filter on `visible: true` and order by
 * `order` so the admin's visibility/ordering controls take effect without a
 * redeploy (Section 3.1, Definition of Done).
 *
 * Wrapped in try/catch → empty fallbacks so a missing/unreachable database
 * degrades to the designed empty states (Section 6) rather than a crash. This is
 * important on first deploy before the DB is migrated/seeded.
 */

const PROJECTS_PAGE_SIZE = 9;
const SERVICES_TEASER = 6;
const PROJECTS_TEASER = 4;

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await withRetry(fn);
  } catch (err) {
    console.error('[content] query failed, using fallback:', err);
    return fallback;
  }
}

export type SectionMap = Record<string, { visible: boolean; title: string; order: number }>;

/** Section visibility/order keyed by section key (Section 3.1). */
export async function getSections(): Promise<SectionMap> {
  return safe(async () => {
    const rows = await prisma.section.findMany({ orderBy: { order: 'asc' } });
    return Object.fromEntries(
      rows.map((r) => [r.key, { visible: r.visible, title: r.title, order: r.order }]),
    );
  }, {});
}

export function getSiteSettings() {
  return safe(() => prisma.siteSettings.findUnique({ where: { id: 'singleton' } }), null);
}

// ---- Homepage teasers ----

export function getFeaturedProjects() {
  return safe(async () => {
    const featured = await prisma.project.findMany({
      where: { visible: true, featured: true },
      include: { coverImage: true },
      orderBy: { order: 'asc' },
      take: PROJECTS_TEASER,
    });
    if (featured.length >= PROJECTS_TEASER) return featured;
    // Fallback: top up with most-recent visible projects (Section 5.2).
    const extra = await prisma.project.findMany({
      where: { visible: true, id: { notIn: featured.map((p) => p.id) } },
      include: { coverImage: true },
      orderBy: { order: 'asc' },
      take: PROJECTS_TEASER - featured.length,
    });
    return [...featured, ...extra];
  }, []);
}

export function getFeaturedServices() {
  return safe(async () => {
    const featured = await prisma.service.findMany({
      where: { visible: true, featured: true },
      include: { icon: true },
      orderBy: { order: 'asc' },
      take: SERVICES_TEASER,
    });
    if (featured.length >= 4) return featured.slice(0, SERVICES_TEASER);
    const extra = await prisma.service.findMany({
      where: { visible: true, id: { notIn: featured.map((s) => s.id) } },
      include: { icon: true },
      orderBy: { order: 'asc' },
      take: SERVICES_TEASER - featured.length,
    });
    return [...featured, ...extra];
  }, []);
}

export function getClients() {
  return safe(
    () =>
      prisma.clientLogo.findMany({
        where: { visible: true },
        include: { logo: true },
        orderBy: { order: 'asc' },
      }),
    [],
  );
}

export function getExpertise() {
  return safe(
    () =>
      prisma.expertiseItem.findMany({
        where: { visible: true },
        orderBy: { order: 'asc' },
      }),
    [],
  );
}

export function getOffers() {
  return safe(
    () =>
      prisma.offer.findMany({
        where: { visible: true },
        include: { image: true },
        orderBy: { order: 'asc' },
      }),
    [],
  );
}

export function getTestimonials() {
  return safe(
    () =>
      prisma.testimonial.findMany({
        where: { visible: true },
        include: { photo: true },
        orderBy: { order: 'asc' },
      }),
    [],
  );
}

// ---- Full listing pages with cursor pagination (Section 5.1) ----

export async function getProjectsPage(cursor?: string) {
  return safe(
    async () => {
      const items = await prisma.project.findMany({
        where: { visible: true },
        include: { coverImage: true },
        orderBy: [{ order: 'asc' }, { id: 'asc' }],
        take: PROJECTS_PAGE_SIZE + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      });
      const hasMore = items.length > PROJECTS_PAGE_SIZE;
      const page = hasMore ? items.slice(0, PROJECTS_PAGE_SIZE) : items;
      return { items: page, nextCursor: hasMore ? page[page.length - 1]!.id : null };
    },
    { items: [], nextCursor: null },
  );
}

export async function getServicesPage(cursor?: string) {
  return safe(
    async () => {
      const items = await prisma.service.findMany({
        where: { visible: true },
        include: { icon: true },
        orderBy: [{ order: 'asc' }, { id: 'asc' }],
        take: PROJECTS_PAGE_SIZE + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      });
      const hasMore = items.length > PROJECTS_PAGE_SIZE;
      const page = hasMore ? items.slice(0, PROJECTS_PAGE_SIZE) : items;
      return { items: page, nextCursor: hasMore ? page[page.length - 1]!.id : null };
    },
    { items: [], nextCursor: null },
  );
}

export function getProjectBySlug(slug: string) {
  return safe(
    () =>
      prisma.project.findFirst({
        where: { slug, visible: true },
        include: { coverImage: true, gallery: true },
      }),
    null,
  );
}

export function getServiceBySlug(slug: string) {
  return safe(
    () => prisma.service.findFirst({ where: { slug, visible: true }, include: { icon: true } }),
    null,
  );
}

export function getOfferBySlug(slug: string) {
  return safe(
    () => prisma.offer.findFirst({ where: { slug, visible: true }, include: { image: true } }),
    null,
  );
}
