/**
 * Seed script (Section 4).
 *
 *  1. Creates the nine homepage Section rows in canonical order, visible.
 *  2. Creates one AdminUser from ADMIN_EMAIL / ADMIN_INITIAL_PASSWORD (hashed;
 *     the plain password is never stored or logged).
 *  3. Creates the SiteSettings singleton with sensible defaults.
 *  4. Leaves all content tables (Project, Service, ...) EMPTY on purpose, so the
 *     Section 6 empty states are exercised on first run and the client populates
 *     real content through the dashboard.
 *
 * Idempotent: safe to re-run (uses upsert where identity is stable).
 */
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/password';

const prisma = new PrismaClient();

// Homepage order, mirroring design/portfolio_vdigital_FINAL.html.
// `approach` ("Mon Approche") exists in the original HTML but not in the spec's
// nine-section list; it is included here so it stays orderable/hideable like the
// rest. `testimonials` is the reverse: in the spec, absent from the original.
const SECTIONS: { key: string; title: string }[] = [
  { key: 'hero', title: 'Hero' },
  { key: 'about', title: 'À propos' },
  { key: 'services', title: 'Services' },
  { key: 'projects', title: 'Réalisations' },
  { key: 'clients', title: 'Clients' },
  { key: 'expertise', title: 'Expertise' },
  { key: 'approach', title: 'Approche' },
  { key: 'offers', title: 'Offres' },
  { key: 'testimonials', title: 'Témoignages' },
  { key: 'contact', title: 'Contact' },
];

async function main() {
  // 1. Sections
  for (const [i, s] of SECTIONS.entries()) {
    await prisma.section.upsert({
      where: { key: s.key },
      update: { title: s.title, order: i },
      create: { key: s.key, title: s.title, order: i, visible: true },
    });
  }
  console.log(`✓ Seeded ${SECTIONS.length} sections`);

  // 2. Admin user
  const email = process.env.ADMIN_EMAIL;
  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD;
  if (email && initialPassword) {
    const passwordHash = await hashPassword(initialPassword);
    await prisma.adminUser.upsert({
      where: { email },
      update: {}, // never overwrite an existing password on re-seed
      create: { email, passwordHash },
    });
    console.log(`✓ Admin user ready: ${email} (change the password on first login)`);
  } else {
    console.warn('⚠ ADMIN_EMAIL / ADMIN_INITIAL_PASSWORD not set — skipping admin user creation.');
  }

  // 3. Site settings singleton
  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      seoTitle: 'VDIGITAL — Vitus Ahanda | Expert en Communication Digitale',
      seoDescription:
        'Community Manager, Social Media Strategist & Brand Builder. Je transforme votre présence digitale en levier de croissance.',
      contactEmail: process.env.NOTIFY_EMAIL_TO ?? null,
      socialLinks: {},
    },
  });
  console.log('✓ Site settings ready');

  // 4. Content tables intentionally left empty (empty states, Section 6).
  console.log('✓ Done. Content tables left empty by design — populate via the dashboard.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
