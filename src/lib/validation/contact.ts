import { z } from 'zod';

/**
 * Shared contact-form schema (Section 8.4) — used by both the client form
 * (React Hook Form resolver) and the server API route. Single source of truth.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Nom trop court').max(120),
  email: z.string().trim().email('Email invalide').max(200),
  subject: z.string().trim().max(200).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Message trop court (10 caractères min.)').max(4000),
  // Cloudflare Turnstile token (Section 8.3). Optional in schema so local dev
  // without keys still works; the API route enforces it when Turnstile is configured.
  turnstileToken: z.string().optional(),
  // Honeypot — must stay empty. Bots that auto-fill every field trip this.
  company: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
