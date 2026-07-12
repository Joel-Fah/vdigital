import type { DashboardStats } from '@/lib/dashboard-stats';

/**
 * Activity-based dashboard insights (v1.2).
 *
 * A rule engine: each rule inspects the stats and optionally emits an insight at
 * one of three priority levels. Add rules to `RULES` as the app grows — the list
 * is sorted by priority and rendered generically, so it scales without touching
 * the UI. `sub` is an admin sub-path the insight links to.
 */
export type InsightLevel = 'high' | 'medium' | 'low';

export type Insight = {
  id: string;
  level: InsightLevel;
  title: string;
  body: string;
  sub?: string;
};

type Rule = (s: DashboardStats) => Insight | null;

const totalContent = (s: DashboardStats) =>
  s.totals.projects +
  s.totals.services +
  s.totals.clients +
  s.totals.expertise +
  s.totals.offers +
  s.totals.testimonials;

const RULES: Rule[] = [
  // --- high: needs attention ---
  (s) =>
    s.totals.unread > 0
      ? {
          id: 'unread',
          level: 'high',
          title: `${s.totals.unread} message${s.totals.unread > 1 ? 's' : ''} non lu${s.totals.unread > 1 ? 's' : ''}`,
          body: 'Des visiteurs vous ont écrit — pensez à leur répondre.',
          sub: 'messages',
        }
      : null,
  (s) =>
    totalContent(s) === 0
      ? {
          id: 'empty-site',
          level: 'high',
          title: 'Votre site est encore vide',
          body: 'Ajoutez vos premiers projets et services pour remplacer les états vides par du vrai contenu.',
          sub: 'projects',
        }
      : null,

  // --- medium: opportunities ---
  (s) =>
    totalContent(s) > 0 && s.totals.projects === 0
      ? {
          id: 'no-projects',
          level: 'medium',
          title: 'Aucun projet publié',
          body: "La section « Réalisations » affiche un état vide tant qu'aucun projet n'est ajouté.",
          sub: 'projects',
        }
      : null,
  (s) =>
    s.totals.projects > 0 && s.featured.projects === 0
      ? {
          id: 'no-featured-projects',
          level: 'medium',
          title: 'Aucun projet mis en avant',
          body: "Le teaser d'accueil affiche les plus récents. Mettez-en en avant pour choisir lesquels apparaissent.",
          sub: 'projects',
        }
      : null,
  (s) =>
    s.totals.testimonials > 0 && s.featured.testimonials === 0
      ? {
          id: 'no-featured-testimonials',
          level: 'medium',
          title: 'Aucun témoignage mis en avant',
          body: "6 témoignages sont choisis au hasard pour l'accueil. Mettez-en en avant pour les contrôler.",
          sub: 'testimonials',
        }
      : null,
  (s) =>
    s.pexelsCount > 0
      ? {
          id: 'pexels',
          level: 'medium',
          title: `${s.pexelsCount} visuel${s.pexelsCount > 1 ? 's' : ''} Pexels provisoire${s.pexelsCount > 1 ? 's' : ''}`,
          body: 'Remplacez les placeholders Pexels par de vraies images quand elles sont prêtes.',
          sub: 'media',
        }
      : null,

  // --- low: tips / info ---
  (s) =>
    totalContent(s) > 0 && s.messages30d === 0
      ? {
          id: 'no-activity',
          level: 'low',
          title: 'Aucun message ce mois-ci',
          body: 'Partagez votre site pour générer des demandes via le formulaire de contact.',
        }
      : null,
  (s) =>
    s.totals.media === 0
      ? {
          id: 'no-media',
          level: 'low',
          title: 'Médiathèque vide',
          body: 'Téléversez vos images (logos, couvertures) pour enrichir le site.',
          sub: 'media',
        }
      : null,
];

const ORDER: Record<InsightLevel, number> = { high: 0, medium: 1, low: 2 };

/** Build the prioritised insight list (highest priority first), capped. */
export function buildInsights(stats: DashboardStats, max = 6): Insight[] {
  return RULES.map((rule) => rule(stats))
    .filter((i): i is Insight => i !== null)
    .sort((a, b) => ORDER[a.level] - ORDER[b.level])
    .slice(0, max);
}
