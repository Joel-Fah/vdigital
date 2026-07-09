import { z } from 'zod';

/**
 * Entity schemas (Section 8.4) — the single validation source for admin forms
 * and their server actions. Arrays arrive as delimited text from the form and
 * are normalised by `parseList`; booleans by `parseBool`.
 */

const optionalUrl = z
  .string()
  .trim()
  .url('URL invalide')
  .optional()
  .or(z.literal('').transform(() => undefined));

const optionalText = (max = 500) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal('').transform(() => undefined));

export const projectSchema = z.object({
  title: z.string().trim().min(2, 'Titre requis').max(160),
  client: optionalText(120),
  category: optionalText(120),
  summary: z.string().trim().min(10, 'Résumé trop court').max(4000),
  link: optionalUrl,
  coverImageId: optionalText(60),
  tags: z.array(z.string().trim().min(1)).max(20).default([]),
  results: z
    .array(
      z.object({
        label: z.string().trim().min(1),
        value: z.string().trim().min(1),
        trend: z.string().trim().optional(),
      }),
    )
    .max(8)
    .default([]),
  featured: z.boolean().default(false),
  visible: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
});

export const serviceSchema = z.object({
  title: z.string().trim().min(2, 'Titre requis').max(160),
  description: z.string().trim().min(10, 'Description trop courte').max(4000),
  iconId: optionalText(60),
  tags: z.array(z.string().trim().min(1)).max(20).default([]),
  featured: z.boolean().default(false),
  visible: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
});

export const clientSchema = z.object({
  name: z.string().trim().min(2, 'Nom requis').max(160),
  sector: optionalText(120),
  link: optionalUrl,
  logoId: optionalText(60),
  visible: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
});

export const expertiseSchema = z.object({
  name: z.string().trim().min(2, 'Nom requis').max(160),
  description: optionalText(300),
  level: z.coerce.number().int().min(0).max(100),
  visible: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
});

export const offerSchema = z.object({
  // Which tab the offer appears under in the "Diagnostics & Formations" section.
  kind: z.enum(['diagnostic', 'formation']).default('diagnostic'),
  name: z.string().trim().min(2, 'Nom requis').max(160),
  description: z.string().trim().min(10, 'Description trop courte').max(4000),
  /** Diagnostics: the "includes" checklist. Formations: the module list. */
  deliverables: z.array(z.string().trim().min(1)).max(30).default([]),
  /** Diagnostics: corner badge. Formations: level. */
  badge: optionalText(80),
  /** Diagnostics: duration pill. Formations: comma-separated meta tags. */
  duration: optionalText(120),
  /** Single emoji shown above the title. */
  icon: optionalText(8),
  priceNote: optionalText(160),
  imageId: optionalText(60),
  visible: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
});

export const testimonialSchema = z.object({
  author: z.string().trim().min(2, 'Auteur requis').max(160),
  role: optionalText(120),
  company: optionalText(120),
  quote: z.string().trim().min(10, 'Citation trop courte').max(2000),
  photoId: optionalText(60),
  visible: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
});

export const siteSettingsSchema = z.object({
  seoTitle: optionalText(200),
  seoDescription: optionalText(400),
  contactEmail: z
    .string()
    .trim()
    .email()
    .optional()
    .or(z.literal('').transform(() => undefined)),
  contactPhone: optionalText(60),
  analyticsId: optionalText(120),
  instagram: optionalUrl,
  linkedin: optionalUrl,
  tiktok: optionalUrl,
  facebook: optionalUrl,
});

/** Split a textarea/CSV value into a trimmed, de-duplicated string array. */
export function parseList(
  value: FormDataEntryValue | null,
  sep: 'comma' | 'lines' = 'comma',
): string[] {
  const raw = typeof value === 'string' ? value : '';
  const parts = sep === 'comma' ? raw.split(',') : raw.split(/\r?\n/);
  return Array.from(new Set(parts.map((p) => p.trim()).filter(Boolean)));
}

export function parseBool(value: FormDataEntryValue | null): boolean {
  return value === 'on' || value === 'true' || value === '1';
}
