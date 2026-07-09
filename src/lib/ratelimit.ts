import 'server-only';
import { createHash } from 'crypto';
import { prisma } from '@/lib/prisma';

/**
 * DB-backed rate limiting (Section 8.3 / 8.4). Deliberately simple and
 * dependency-free — a small site doesn't need Redis. Login attempts are recorded
 * in LoginAttempt for auditability; contact submissions reuse the same table
 * with a synthetic identifier.
 */

const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 min
const LOGIN_MAX_FAILS = 5; // 6th rapid attempt is blocked (Section 8.3)
const CONTACT_WINDOW_MS = 60 * 60 * 1000; // 1h
const CONTACT_MAX = 5;

/** Hash an identifier (IP/email) so raw PII isn't stored (Section 8.4). */
export function hashIdentifier(value: string): string {
  return createHash('sha256')
    .update(value + (process.env.AUTH_SECRET ?? ''))
    .digest('hex')
    .slice(0, 32);
}

/** Best-effort client IP from proxy headers (Cloudflare/Vercel). */
export function clientIp(headers: Headers): string {
  return (
    headers.get('cf-connecting-ip') ??
    headers.get('x-real-ip') ??
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}

/** Returns true if the identifier is currently rate-limited for login. */
export async function isLoginBlocked(identifier: string): Promise<boolean> {
  const since = new Date(Date.now() - LOGIN_WINDOW_MS);
  const fails = await prisma.loginAttempt.count({
    where: { identifier: hashIdentifier(identifier), success: false, createdAt: { gte: since } },
  });
  return fails >= LOGIN_MAX_FAILS;
}

export async function recordLoginAttempt(identifier: string, success: boolean): Promise<void> {
  await prisma.loginAttempt.create({
    data: { identifier: hashIdentifier(identifier), success },
  });
}

/** Contact-form rate limit per IP (Section 8.4). */
export async function isContactBlocked(ip: string): Promise<boolean> {
  const since = new Date(Date.now() - CONTACT_WINDOW_MS);
  const count = await prisma.loginAttempt.count({
    where: { identifier: `contact:${hashIdentifier(ip)}`, createdAt: { gte: since } },
  });
  return count >= CONTACT_MAX;
}

export async function recordContactAttempt(ip: string): Promise<void> {
  await prisma.loginAttempt.create({
    data: { identifier: `contact:${hashIdentifier(ip)}`, success: true },
  });
}
