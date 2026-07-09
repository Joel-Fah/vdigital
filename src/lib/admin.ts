import 'server-only';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { env } from '@/lib/env';

/** Build an absolute admin URL under the obscured base path. */
export function adminPath(sub = ''): string {
  const clean = sub.replace(/^\/+/, '');
  return `/${env.ADMIN_BASE_PATH}${clean ? `/${clean}` : ''}`;
}

/**
 * Server-side session guard for every admin page/action (Section 8.4 — never
 * trust a client flag). Middleware already redirects, but this is defence in
 * depth for direct server-component/route access.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect(adminPath());
  return session;
}
