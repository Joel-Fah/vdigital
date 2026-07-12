import { PrismaClient } from '@prisma/client';
import { withRetry } from '@/lib/db-retry';

/**
 * Prisma singleton with a global cold-start retry.
 *
 * The `$allOperations` extension retries connection-class failures (Neon
 * scale-to-zero → `P1001` / `Closed`) with backoff, so EVERY query — public
 * reads, admin list pages, and server actions — survives a cold resume without
 * surfacing an error. The singleton also avoids exhausting the connection pool
 * during dev hot-reload.
 */
function createClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  }).$extends({
    query: {
      $allOperations({ args, query }) {
        return withRetry(() => query(args));
      },
    },
  });
}

type ExtendedPrisma = ReturnType<typeof createClient>;

const globalForPrisma = globalThis as unknown as { prisma?: ExtendedPrisma };

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
