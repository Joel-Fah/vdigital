import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from '@/lib/auth.config';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';
import { recordLoginAttempt } from '@/lib/ratelimit';

/**
 * Full Auth.js config (Node runtime) — adds the Credentials provider whose
 * `authorize` verifies the password with argon2 (Section 8.3). Rate limiting,
 * attempt logging, and Turnstile live in the login server action
 * (src/app/[adminBasePath]/(auth)/actions.ts) so all abuse-prevention logic is
 * in one place; `authorize` stays a pure credential check.
 *
 * Errors are intentionally generic — never reveal whether the email exists.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const email = typeof credentials?.email === 'string' ? credentials.email : '';
        const password = typeof credentials?.password === 'string' ? credentials.password : '';
        if (!email || !password) return null;

        const user = await prisma.adminUser.findUnique({ where: { email } });
        if (!user) return null;

        const ok = await verifyPassword(user.passwordHash, password);
        if (!ok) return null;

        // Log successful logins for auditability (failures are logged in the
        // login action, which also holds the IP identifier).
        await recordLoginAttempt(user.email, true);
        return { id: user.id, email: user.email };
      },
    }),
  ],
});
