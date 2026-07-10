/**
 * Static copy, transcribed VERBATIM from design/portfolio_vdigital_FINAL.html.
 *
 * This is the non-dynamic chrome of the site: hero, about/award/timeline, the
 * "Approche" steps, section headers, expertise platforms/tools, client sectors,
 * contact panel and footer. It is a rebuild, not a redesign — do not reword.
 *
 * TODO(decision): the Section 4 schema models *list* content only (projects,
 * services, clients, expertise, offers, testimonials). To make this copy
 * editable from the dashboard, promote it into `SiteSettings` JSON fields plus a
 * small admin form; the wiring point is `getSiteSettings()` in src/lib/content.ts.
 */

export const LOGO_SRC = '/vdigital-logo.jpg';
export const AWARD_MEDAL_SRC = '/award-medal.jpg';

export const CONTACT_DIRECT = {
  email: 'vitusahanda@yahoo.fr',
  linkedin: 'https://www.linkedin.com/feed/',
};

/** Nav links, exactly as the original (6 anchors + CTA). */
export const NAV_LINKS: { key: string; label: string }[] = [
  { key: 'about', label: 'À propos' },
  { key: 'services', label: 'Services' },
  { key: 'projects', label: 'Réalisations' },
  { key: 'clients', label: 'Clients' },
  { key: 'offers', label: 'Offres' },
  { key: 'contact', label: 'Contact' },
];

export const HERO = {
  tag: 'Expert en Communication Digitale',
  firstName: 'Vitus',
  lastName: 'Ahanda',
  title: 'Community Manager · Social Media Strategist · Brand Builder',
  description:
    'Je transforme votre présence digitale en véritable levier de croissance. Stratégie, contenu, engagement — je pilote votre marque sur tous les canaux avec précision et créativité.',
  ctaPrimary: 'Travaillons ensemble',
  ctaOutline: 'Voir mes réalisations',
  badges: [
    { icon: 'trophy', text: 'Canal+ Creative Talent' },
    { icon: 'bar-chart', text: '13+ Marques' },
    { icon: 'sparkle', text: "5 ans d'expérience" },
  ] as const,
  stats: [
    { value: '5', sup: '+', label: "Années d'expérience" },
    { value: '13', sup: '+', label: 'Marques accompagnées' },
    { value: '1,6M', sup: '', label: 'Vues générées' },
    { value: '1', sup: '', label: 'Prix continental Canal+' },
  ],
};

export const ABOUT = {
  initials: 'VU',
  name: 'Vitus Ahanda',
  role: 'Expert Communication Digitale',
  location: 'Yaoundé, Cameroun',
  miniStats: [
    { value: '5+', label: 'Années' },
    { value: '13+', label: 'Clients' },
    { value: '1,6M', label: 'Vues' },
    { icon: 'trophy' as const, label: 'Canal+' },
  ],
  eyebrow: '— À propos de moi',
  titleLead: 'Stratège digital,',
  titleRest: 'bâtisseur de ',
  titleEm: 'communautés',
  bio1: "Avec plus de 5 ans d'expérience dans la communication digitale et le marketing, je suis spécialisé dans le Community Management et le Social Media Management. Mon approche combine rigueur stratégique, sens créatif et maîtrise des outils digitaux pour délivrer des résultats mesurables.",
  bio2: "J'ai accompagné plus de 13 marques dans des secteurs aussi variés que l'agroalimentaire, la beauté, les médias, le sport et la grande distribution — en France comme au Cameroun.",
  highlightPre: 'Lauréat de la compétition africaine ',
  highlightStrong: 'Canal+ Creative Talent',
  highlightPost:
    " organisée par le Groupe Canal+, je fais partie des professionnels reconnus pour l'excellence de leur vision créative et stratégique en Afrique.",
  award: {
    tagIcon: 'globe' as const,
    tag: 'Distinction africaine',
    name: 'Lauréat — Canal+ Creative Talent',
    org: 'Canal+ Group · Compétition panafricaine de créativité et communication',
    desc: "Sélectionné parmi les meilleurs talents créatifs du continent africain. Une reconnaissance continentale de l'excellence en stratégie créative, communication et production de contenu à forte valeur ajoutée.",
    pill: 'Lauréat',
  },
  timelineLabel: '— Parcours professionnel',
  timeline: [
    {
      period: '2024 — 2026',
      role: 'Expert indépendant · Fondateur VDIGITAL',
      org: 'Community Management · Social Media Strategy · Branding · 13+ clients accompagnés',
      gold: true,
    },
    {
      period: 'Lauréat',
      role: 'Canal+ Creative Talent',
      org: 'Canal+ Group · Compétition africaine de créativité et communication',
      gold: true,
    },
    {
      period: '2023 — 2024',
      role: 'Social Media Manager · Sembē Agency',
      org: 'Gestion grands comptes — BAO Supermarché · Stratégie multiplateforme France',
      gold: false,
    },
    {
      period: '2022 — 2023',
      role: 'Community Manager & Rédacteur',
      org: 'Canal Sauce Jaune · Chococam · Laboratoires Carimo & Eugenia · Henkes',
      gold: false,
    },
    {
      period: '2021 — 2022',
      role: 'Chargé de Communication Digitale',
      org: "Premiers projets clients · Développement de l'expertise stratégie digitale africaine",
      gold: false,
    },
  ],
};

/** Section headers — eyebrow / title (with the <em> word) / optional sub. */
export const SECTION_COPY = {
  services: {
    eyebrow: '— Ce que je fais',
    titleLead: 'Mes ',
    titleEm: 'Services',
    sub: 'Une offre complète de communication digitale pour faire rayonner votre marque sur tous les réseaux.',
  },
  projects: {
    eyebrow: '— Preuves par les chiffres',
    titleLead: 'Études de ',
    titleEm: 'Cas',
    sub: 'Des résultats concrets pour des clients réels — avec les données pour le prouver.',
  },
  clients: {
    eyebrow: "— Ils m'ont fait confiance",
    titleLead: 'Références ',
    titleEm: 'Clients',
    sub: '13+ marques accompagnées dans 6 secteurs différents, en France et au Cameroun.',
  },
  expertise: {
    eyebrow: '— Compétences & Outils',
    titleLead: 'Mon ',
    titleEm: 'Expertise',
    sub: undefined,
  },
  approach: {
    eyebrow: '— Ma méthode',
    titleLead: 'Mon ',
    titleEm: 'Approche',
    sub: undefined,
  },
  offers: {
    eyebrow: '— Offres complémentaires',
    titleLead: 'Diagnostics & ',
    titleEm: 'Formations',
    sub: 'Au-delà de la gestion quotidienne, je vous accompagne pour analyser votre situation digitale et monter en compétences avec des formations sur mesure.',
  },
  testimonials: {
    eyebrow: '— Ce qu’ils en disent',
    titleLead: 'Ils ',
    titleEm: 'témoignent',
    sub: undefined,
  },
} as const;

/** "Mon Approche" — four numbered steps. */
export const APPROACH_STEPS = [
  {
    num: '01',
    title: 'Audit & Analyse',
    text: 'Analyse de votre présence actuelle, de votre audience et de vos concurrents pour identifier les opportunités de croissance.',
  },
  {
    num: '02',
    title: 'Stratégie',
    text: "Définition d'objectifs clairs, choix des canaux adaptés et élaboration d'un plan éditorial sur mesure avec KPIs définis.",
  },
  {
    num: '03',
    title: 'Création & Exécution',
    text: 'Production de contenus de qualité, planification et publication avec cohérence visuelle et éditoriale irréprochable.',
  },
  {
    num: '04',
    title: 'Suivi & Optimisation',
    text: 'Analyse des performances, reporting mensuel et ajustements continus pour maximiser vos résultats et votre ROI.',
  },
];

/** Expertise right column — static platforms + tools. */
export const PLATFORMS_LABEL = 'Plateformes maîtrisées';
export const PLATFORMS = [
  { name: 'Instagram', sub: 'Reels · Stories' },
  { name: 'TikTok', sub: 'Content · Trends' },
  { name: 'Facebook', sub: 'Ads · Pages' },
  { name: 'LinkedIn', sub: 'B2B · Personal' },
  { name: 'YouTube', sub: 'Shorts · SEO' },
  { name: 'X / Twitter', sub: 'Veille · Threads' },
];
export const TOOLS = {
  label: 'Outils & Technologies',
  text: 'Canva · Meta Business Suite · Hootsuite · Buffer · Later · Google Analytics · Notion · CapCut · Adobe Express · TikTok Studio',
};

/** Client sectors pills (static, below the dynamic client list). */
export const SECTORS = [
  'Agroalimentaire',
  'Beauté & Cosmétique',
  'Média & Presse',
  'Sport & Football',
  'Mode & Lifestyle',
  'Restauration & Food',
  'Santé & Pharmacie',
  'Grande distribution',
  'ONG & Impact social',
  'Boissons & FMCG',
];

/** Offres section — static chrome around the DB-driven cards. */
export const OFFERS_TABS = [
  { value: 'diagnostic', label: 'Diagnostics', icon: 'search' },
  { value: 'formation', label: 'Formations', icon: 'graduation' },
] as const;

export const OFFERS_AUDIENCE = {
  diagnostic: {
    label: "— À qui s'adressent ces diagnostics ?",
    items: [
      { icon: 'building', label: 'Entreprises', sub: 'PME & startups' },
      { icon: 'user', label: 'Indépendants', sub: 'Freelances & consultants' },
      { icon: 'palette', label: 'Créateurs', sub: 'Influenceurs & artistes' },
      { icon: 'globe', label: 'ONG & assos', sub: 'Organisations à impact' },
    ],
    cta: {
      title: 'Vous ne savez pas quel diagnostic choisir ?',
      sub: 'Écrivez-moi, je vous oriente vers la formule adaptée à votre situation.',
    },
  },
  formation: {
    label: "— À qui s'adressent ces formations ?",
    items: [
      { icon: 'users', label: 'Équipes marketing', sub: 'En entreprise' },
      { icon: 'graduation', label: 'Étudiants', sub: 'Com & marketing' },
      { icon: 'rocket', label: 'Entrepreneurs', sub: 'Gérer seul ses réseaux' },
      { icon: 'globe', label: 'Associations', sub: 'Visibilité & impact' },
    ],
    cta: {
      title: 'Formation individuelle ou pour votre équipe ?',
      sub: 'Toutes les formations sont adaptables en intra-entreprise, en groupe ou en coaching individuel.',
    },
  },
} as const;

export const OFFERS_CTA_BUTTONS = {
  primary: 'Demander un devis →',
  outline: 'LinkedIn',
};

export const CONTACT = {
  eyebrow: '— Démarrons ensemble',
  titleLead: 'Prêt à booster votre',
  titleEm: 'présence digitale ?',
  sub: 'Discutons de votre projet. Je vous accompagne de la stratégie à l’exécution pour faire rayonner votre marque sur les réseaux sociaux.',
};

export const FOOTER = {
  tagline: 'Vitus Ahanda · Expert Communication & Marketing Digital · Yaoundé, Cameroun',
  copyright: '© 2026 VDIGITAL. Tous droits réservés.',
};
