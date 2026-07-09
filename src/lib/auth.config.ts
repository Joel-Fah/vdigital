import type { NextAuthConfig } from 'next-auth';
import { env } from '@/lib/env';

/**
 * Edge-safe Auth.js config (Section 8.3).
 *
 * This half contains NO native/Node-only code (no argon2, no Prisma) so it can
 * be imported by the middleware, which runs on the edge runtime. The full config
 * (src/lib/auth.ts) spreads this and adds the Credentials provider whose
 * `authorize` uses argon2 + Prisma and therefore runs only in the Node runtime.
 */
export const authConfig = {
  trustHost: true,
  session: { strategy: 'jwt', maxAge: 60 * 60 * 8 }, // 8h, refreshed while active
  pages: {
    // Login lives at the obscured admin base path root (Section 8.2).
    signIn: `/${env.ADMIN_BASE_PATH}`,
  },
  callbacks: {
    // Used by the middleware wrapper to gate protected routes.
    authorized({ auth }) {
      return Boolean(auth?.user);
    },
    async jwt({ token, user }) {
      if (user) token.uid = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token.uid && session.user) session.user.id = token.uid as string;
      return session;
    },
  },
  providers: [], // added in auth.ts (Node runtime)
} satisfies NextAuthConfig;
