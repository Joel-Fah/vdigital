/**
 * Centralised, lazily-validated environment access.
 *
 * We deliberately do NOT hard-fail at import time on missing optional service
 * keys (R2, Pexels, SMTP, Turnstile) so the app still boots and renders the
 * public site + admin during incremental setup. Each integration checks for its
 * own keys and degrades gracefully (Section 7 placeholders, Section 6 empties).
 */

function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing required environment variable: ${name}. See .env.example.`);
  }
  return v;
}

function optional(name: string): string | undefined {
  return process.env[name] || undefined;
}

export const env = {
  // Required for the app to function at all.
  get DATABASE_URL() {
    return required('DATABASE_URL');
  },
  get AUTH_SECRET() {
    return required('AUTH_SECRET');
  },
  // Obscured admin path (Section 8.2). Defaults to a non-guessable, typeable value.
  ADMIN_BASE_PATH: (process.env.ADMIN_BASE_PATH || 'studio-vd').replace(/^\/+|\/+$/g, ''),
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',

  // Optional integrations — presence-gated.
  r2: {
    accountId: optional('R2_ACCOUNT_ID'),
    accessKeyId: optional('R2_ACCESS_KEY_ID'),
    secretAccessKey: optional('R2_SECRET_ACCESS_KEY'),
    bucket: optional('R2_BUCKET_NAME'),
    publicUrl: optional('R2_PUBLIC_URL'),
    get isConfigured() {
      return Boolean(
        this.accountId && this.accessKeyId && this.secretAccessKey && this.bucket && this.publicUrl,
      );
    },
  },
  pexels: {
    apiKey: optional('PEXELS_API_KEY'),
    get isConfigured() {
      return Boolean(this.apiKey);
    },
  },
  turnstile: {
    siteKey: optional('NEXT_PUBLIC_TURNSTILE_SITE_KEY'),
    secretKey: optional('TURNSTILE_SECRET_KEY'),
    get isConfigured() {
      return Boolean(this.siteKey && this.secretKey);
    },
  },
  smtp: {
    host: optional('SMTP_HOST'),
    port: Number(process.env.SMTP_PORT || 465),
    user: optional('SMTP_USER'),
    password: optional('SMTP_PASSWORD'),
    notifyTo: optional('NOTIFY_EMAIL_TO'),
    get isConfigured() {
      return Boolean(this.host && this.user && this.password && this.notifyTo);
    },
  },
  analyticsId: optional('NEXT_PUBLIC_ANALYTICS_ID'),
};
