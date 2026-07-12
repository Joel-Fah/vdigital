import 'server-only';

/**
 * Retry helper for Neon cold-starts.
 *
 * Neon's free tier scales the compute to zero after a few minutes idle. The
 * first query after that wakes it, but the stale pooled connection surfaces as
 * `P1001` ("Can't reach database server") or a `Closed` connection error before
 * Prisma reconnects — and a cold resume can take a couple of seconds. Retrying
 * connection-class errors with backoff makes the wake-up invisible.
 *
 * This is applied globally as a Prisma client extension (`src/lib/prisma.ts`),
 * so every query — public reads, admin list pages, server actions — is covered.
 * Only connection-class errors are retried; real query errors fail fast.
 */
const RETRYABLE = [
  'P1001', // can't reach database server
  'P1002', // server reached but timed out
  'P1008', // operation timed out
  'P1017', // server has closed the connection
];

export function isRetryable(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const code = (err as { code?: string }).code;
  if (code && RETRYABLE.includes(code)) return true;
  const msg = (err as { message?: string }).message ?? '';
  return (
    msg.includes("Can't reach database server") ||
    msg.includes('Connection closed') ||
    msg.includes('kind: Closed') ||
    msg.includes('Closed')
  );
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Backoff gives Neon time to resume (~5.6s total across the retries).
const DELAYS = [300, 800, 1500, 3000];

export async function withRetry<T>(fn: () => Promise<T>, attempts = DELAYS.length + 1): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1 && isRetryable(err)) {
        await sleep(DELAYS[i] ?? 3000);
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}
