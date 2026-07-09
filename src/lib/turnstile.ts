import 'server-only';
import { env } from '@/lib/env';

/**
 * Server-side Cloudflare Turnstile verification (Section 8.3).
 * When Turnstile is not configured (no secret key), verification is skipped so
 * local dev works — but in production the keys should always be set.
 */
export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<boolean> {
  if (!env.turnstile.isConfigured) return true; // not configured → skip (dev)
  if (!token) return false;

  try {
    const form = new URLSearchParams();
    form.append('secret', env.turnstile.secretKey!);
    form.append('response', token);
    if (ip) form.append('remoteip', ip);

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
    });
    const data = (await res.json()) as { success: boolean };
    return data.success === true;
  } catch (err) {
    console.error('[turnstile] verification error:', err);
    return false;
  }
}
