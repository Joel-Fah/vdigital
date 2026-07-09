import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/lib/auth.config';
import { env } from '@/lib/env';

/**
 * Edge middleware gating the obscured admin area (Section 8.2 / 8.3).
 * Uses only the edge-safe authConfig (no argon2/Prisma).
 *
 * - `/{ADMIN}`         → login page (public). Authenticated users are bounced to
 *                        the dashboard.
 * - `/{ADMIN}/...`     → protected. Unauthenticated users are redirected to login
 *                        with a callbackUrl.
 */
const { auth } = NextAuth(authConfig);
const ADMIN = env.ADMIN_BASE_PATH;

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = Boolean(req.auth?.user);

  const isLoginPage = pathname === `/${ADMIN}` || pathname === `/${ADMIN}/`;
  const isAdminArea = pathname.startsWith(`/${ADMIN}/`) && !isLoginPage;

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL(`/${ADMIN}/dashboard`, req.nextUrl));
  }

  if (isAdminArea && !isLoggedIn) {
    const url = new URL(`/${ADMIN}`, req.nextUrl);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  // Run on everything except static assets and the auth API (which handles its own).
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)',
  ],
};
