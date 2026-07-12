import { env } from '@/lib/env';
import {
  getSections,
  getFeaturedServices,
  getFeaturedProjects,
  getClients,
  getExpertise,
  getOffers,
  getHomeTestimonials,
  getSiteSettings,
} from '@/lib/content';
import { Hero } from '@/components/sections/hero';
import { About } from '@/components/sections/about';
import { ServicesTeaser } from '@/components/sections/services-teaser';
import { ProjectsTeaser } from '@/components/sections/projects-teaser';
import { ClientsSection } from '@/components/sections/clients-section';
import { ExpertiseSection } from '@/components/sections/expertise-section';
import { ApproachSection } from '@/components/sections/approach-section';
import { OffersSection } from '@/components/sections/offers-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { ContactSection } from '@/components/sections/contact-section';
import { PersonJsonLd } from '@/components/seo/json-ld';

// ISR — content stays editable from the dashboard but pages are cached/fast
// (Section 1: hybrid SSG/ISR). Revalidate hourly; admin writes can also trigger
// on-demand revalidation later.
export const revalidate = 3600;

/**
 * Home — single scrolling page. Sections render in the DB-defined order and only
 * when `Section.visible` is true (Section 3.1 / Definition of Done). Testimonials
 * additionally self-hide when empty (Section 6).
 */
export default async function HomePage() {
  const [sections, services, projects, clients, expertise, offers, testimonials, settings] =
    await Promise.all([
      getSections(),
      getFeaturedServices(),
      getFeaturedProjects(),
      getClients(),
      getExpertise(),
      getOffers(),
      getHomeTestimonials(),
      getSiteSettings(),
    ]);

  // Map each section key to its rendered node.
  const nodes: Record<string, React.ReactNode> = {
    hero: <Hero key="hero" />,
    about: <About key="about" />,
    services: <ServicesTeaser key="services" services={services} />,
    projects: <ProjectsTeaser key="projects" projects={projects} />,
    clients: <ClientsSection key="clients" clients={clients} />,
    expertise: <ExpertiseSection key="expertise" items={expertise} />,
    approach: <ApproachSection key="approach" />,
    offers: <OffersSection key="offers" offers={offers} />,
    testimonials: (
      <TestimonialsSection
        key="testimonials"
        testimonials={testimonials.items}
        total={testimonials.total}
      />
    ),
    contact: (
      <ContactSection key="contact" settings={settings} turnstileSiteKey={env.turnstile.siteKey} />
    ),
  };

  // Canonical order as a fallback; DB `order` wins when Section rows exist.
  // Mirrors the original page order: hero → about → services → cases → clients
  // → expertise → approche → offres → contact (testimonials is our addition).
  const CANONICAL = [
    'hero',
    'about',
    'services',
    'projects',
    'clients',
    'expertise',
    'approach',
    'offers',
    'testimonials',
    'contact',
  ];

  const ordered = Object.keys(sections).length
    ? Object.entries(sections)
        .filter(([, s]) => s.visible)
        .sort((a, b) => a[1].order - b[1].order)
        .map(([key]) => key)
    : CANONICAL;

  // Hero always renders (it's the page header) even if a Section row is missing.
  const keys = ordered.includes('hero') ? ordered : ['hero', ...ordered];

  return (
    <>
      <PersonJsonLd settings={settings} />
      {keys.map((key, i) => {
        const node = nodes[key];
        if (!node) return null;
        return (
          <div key={key}>
            {node}
            {i < keys.length - 1 && <div className="divider" />}
          </div>
        );
      })}
    </>
  );
}
