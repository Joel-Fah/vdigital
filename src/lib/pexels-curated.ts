/**
 * Curated free Pexels images — used instead of the Pexels API (per the v1.0
 * decision to not implement the API). These are stable, license-free Pexels
 * direct-image URLs on-theme for a digital-communication portfolio. All were
 * verified to resolve (HTTP 200).
 *
 * Pexels' licence doesn't require attribution, but we keep the photo page link
 * for traceability and good practice.
 */
export type CuratedPhoto = {
  id: string;
  /** Direct image URL (query string controls size/compression). */
  base: string;
  page: string;
  alt: string;
};

const RAW: CuratedPhoto[] = [
  {
    id: '3184291',
    base: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    page: 'https://www.pexels.com/photo/3184291/',
    alt: 'Équipe marketing en réunion de travail',
  },
  {
    id: '3184465',
    base: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
    page: 'https://www.pexels.com/photo/3184465/',
    alt: 'Collaboration créative autour dun ordinateur portable',
  },
  {
    id: '1181244',
    base: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg',
    page: 'https://www.pexels.com/photo/1181244/',
    alt: 'Création de contenu sur ordinateur',
  },
  {
    id: '3277808',
    base: 'https://images.pexels.com/photos/3277808/pexels-photo-3277808.jpeg',
    page: 'https://www.pexels.com/photo/3277808/',
    alt: 'Espace de travail moderne',
  },
  {
    id: '905163',
    base: 'https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg',
    page: 'https://www.pexels.com/photo/905163/',
    alt: 'Stratégie digitale et réseaux sociaux',
  },
  {
    id: '1595385',
    base: 'https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg',
    page: 'https://www.pexels.com/photo/1595385/',
    alt: 'Ambiance de bureau créatif',
  },
];

/** Build a sized URL from a curated photo. */
export function pexelsUrl(photo: CuratedPhoto, width = 1260): string {
  return `${photo.base}?auto=compress&cs=tinysrgb&w=${width}`;
}

export const CURATED_PEXELS: CuratedPhoto[] = RAW;

/** Deterministic-ish random pick (used for the login background). */
export function randomPexels(): CuratedPhoto {
  return RAW[Math.floor(Math.random() * RAW.length)]!;
}
