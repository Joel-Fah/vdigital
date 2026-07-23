import { z } from 'zod';
import { stripHtml } from '@/lib/utils';

/**
 * Entity schemas (Section 8.4) — the single validation source for admin forms
 * and their server actions. Arrays arrive as delimited text from the form and
 * are normalised by `parseList`; booleans by `parseBool`.
 *
 * Long fields hold rich-text HTML from the Tiptap editor; `richText()` validates
 * the *visible* text length (tags stripped) and caps raw length. The HTML is
 * sanitized on write in the server actions (src/lib/html.ts).
 */
const richText = (min: number, message: string) =>
  z
    .string()
    .max(12000)
    .refine((v) => stripHtml(v).length >= min, { message });

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

/** Coerces "" / null → undefined; otherwise a positive integer. Empty number inputs. */
const optionalPositiveInt = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? undefined : v),
  z.coerce.number().int().positive('Doit être un entier positif').optional(),
);

/** Empty-string escape hatch for optional `z.enum` selects (unselected → undefined). */
const zEmptyToUndefined = z.literal('').transform(() => undefined);

export const projectSchema = z.object({
  title: z.string().trim().min(2, 'Titre requis').max(160),
  client: optionalText(120),
  category: optionalText(120),
  summary: richText(10, 'Résumé trop court'),
  link: optionalUrl,
  coverImageId: optionalText(60),
  galleryIds: z.array(z.string().trim().min(1).max(60)).max(12).default([]),
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
  description: richText(10, 'Description trop courte'),
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
  description: richText(10, 'Description trop courte'),
  /** Diagnostics: the "includes" checklist. Formations: the module list. */
  deliverables: z.array(z.string().trim().min(1)).max(30).default([]),
  /** Diagnostics: corner badge. Formations: level. */
  badge: optionalText(80),
  /** Duration: positive integer + unit. */
  durationValue: optionalPositiveInt,
  durationUnit: z.enum(['hour', 'day', 'week', 'month']).optional().or(zEmptyToUndefined),
  /** Price: integer amount + currency. */
  priceAmount: optionalPositiveInt,
  priceCurrency: z.enum(['EUR', 'USD', 'FCFA']).optional().or(zEmptyToUndefined),
  imageId: optionalText(60),
  visible: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
});

/** Reasonable testimonial length so cards don't blow out the masonry layout. */
export const TESTIMONIAL_MAX = 360;

export const testimonialSchema = z.object({
  author: z.string().trim().min(2, 'Auteur requis').max(120),
  role: optionalText(80),
  company: optionalText(80),
  quote: z
    .string()
    .trim()
    .min(10, 'Citation trop courte')
    .max(TESTIMONIAL_MAX, `Citation trop longue (${TESTIMONIAL_MAX} caractères max.)`),
  photoId: optionalText(60),
  featured: z.boolean().default(false),
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
