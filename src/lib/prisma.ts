import { PrismaClient } from '@prisma/client';

/**
 * Prisma singleton — avoids exhausting the Neon connection pool during dev
 * hot-reload (Next.js re-evaluates modules on every change).
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
