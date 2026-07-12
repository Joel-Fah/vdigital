import { z } from 'zod';

/**
 * Shared contact schema (Section 8.4) — used by the client form (React Hook Form
 * resolver) and the server API route. Single source of truth.
 */

/** Predefined, intuitive subjects for the contact form + an "Autre" escape hatch. */
export const CONTACT_SUBJECTS = [
  'Community Management',
  'Social Media Strategy',
  'Création de contenu',
  'Branding & communication',
  'Diagnostic / audit de présence',
  'Formation',
  'Collaboration / partenariat',
  'Autre',
] as const;

export const OTHER_SUBJECT = 'Autre';

const email = z.string().trim().email('Email invalide').max(200);
const whatsapp = z
  .string()
  .trim()
  .max(40)
  .optional()
  .or(z.literal('').transform(() => undefined));
const subject = z
  .string()
  .trim()
  .max(200)
  .optional()
  .or(z.literal('').transform(() => undefined));
const message = z.string().trim().min(10, 'Message trop court (10 caractères min.)').max(4000);
// Cloudflare Turnstile token (Section 8.3) — enforced server-side when configured.
const turnstileToken = z.string().optional();
// Honeypot — must stay empty. Bots that auto-fill every field trip this.
const company = z.string().max(0).optional();

/** Full form schema — name required. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Nom trop court').max(120),
  email,
  whatsapp,
  subject,
  message,
  turnstileToken,
  company,
});

/**
 * Server-side schema — name optional (the quick-request drawer flow only asks
 * for email/WhatsApp; the route fills a name from the email local part).
 */
export const contactApiSchema = z.object({
  name: z.string().trim().max(120).optional(),
  email,
  whatsapp,
  subject,
  message,
  turnstileToken,
  company,
});

export type ContactInput = z.infer<typeof contactSchema>;
