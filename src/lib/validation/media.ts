import { z } from 'zod';

/** Alt text is REQUIRED on upload (Section 7.6) — enforced here and in the form. */
export const uploadMediaSchema = z.object({
  altText: z.string().trim().min(2, 'Le texte alternatif est obligatoire.').max(300),
});

export const updateAltSchema = z.object({
  id: z.string().min(1),
  altText: z.string().trim().min(2, 'Le texte alternatif est obligatoire.').max(300),
});

export const importPexelsSchema = z.object({
  pexelsId: z.string().min(1),
  url: z.string().url(),
  altText: z.string().trim().max(300).optional(),
  credit: z.string().max(200).optional(),
  width: z.coerce.number().int().optional(),
  height: z.coerce.number().int().optional(),
});
