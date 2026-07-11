import 'server-only';

/**
 * Retry a DB call through a Neon cold-start.
 *
 * Neon's free tier scales the compute to zero after a few minutes idle. The
 * first query after that wakes it, but the stale pooled connection surfaces as
 * `P1001` ("Can't reach database server") or a `Closed` connection error before
 * Prisma reconnects. Those are transient — a short retry makes the wake-up
 * invisible instead of showing empty states / logging a scary error.
 *
 * Only connection-class errors are retried; real query errors fail fast.
 */
const RETRYABLE = [
  'P1001', // can't reach database server
  'P1002', // server reached but timed out
  'P1017', // server has closed the connection
];

function isRetryable(err: unknown): boolean {
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

export async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastErr: unknown;
  // Backoff gives Neon time to resume: ~250ms, ~750ms.
  const delays = [250, 750];
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1 && isRetryable(err)) {
        await sleep(delays[i] ?? 750);
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}
