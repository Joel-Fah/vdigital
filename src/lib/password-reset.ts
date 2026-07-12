import 'server-only';
import { randomBytes, createHash } from 'crypto';
import { prisma } from '@/lib/prisma';

/**
 * Password-reset tokens (v1.2 forgot-password). Secure but lightweight:
 * - 256-bit random token; only its SHA-256 hash is stored.
 * - 1-hour expiry, single-use (usedAt).
 * - Generic responses everywhere so the flow never reveals whether an email
 *   exists (enumeration-safe).
 */
const TTL_MS = 60 * 60 * 1000; // 1 hour
const MAX_ACTIVE_PER_EMAIL = 3; // basic anti-spam per 15 min

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Create a reset token for `email` IF an admin with that email exists.
 * Returns the raw token (to embed in the emailed link) or null. Always call this
 * behind a generic success message.
 */
export async function createResetToken(email: string): Promise<string | null> {
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) return null;

  // Anti-spam: cap active (recent) tokens per email.
  const since = new Date(Date.now() - 15 * 60 * 1000);
  const recent = await prisma.passwordResetToken.count({
    where: { email, createdAt: { gte: since } },
  });
  if (recent >= MAX_ACTIVE_PER_EMAIL) return null;

  const token = randomBytes(32).toString('hex');
  await prisma.passwordResetToken.create({
    data: { tokenHash: hashToken(token), email, expiresAt: new Date(Date.now() + TTL_MS) },
  });
  return token;
}

/** Returns the email if the token is valid (exists, unexpired, unused), else null. */
export async function validateResetToken(token: string): Promise<string | null> {
  if (!token) return null;
  const row = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
  });
  if (!row || row.usedAt || row.expiresAt < new Date()) return null;
  return row.email;
}

/** Marks the token used. Call inside the same flow as the password update. */
export async function consumeResetToken(token: string): Promise<void> {
  await prisma.passwordResetToken.updateMany({
    where: { tokenHash: hashToken(token), usedAt: null },
    data: { usedAt: new Date() },
  });
}
