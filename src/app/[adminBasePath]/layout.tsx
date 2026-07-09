import { notFound } from 'next/navigation';
import { env } from '@/lib/env';

/**
 * Guard for the obscured admin segment (Section 8.2). Because `[adminBasePath]`
 * is a dynamic route, ANY top-level path would otherwise match — so we 404
 * unless the segment equals the configured ADMIN_BASE_PATH. Rotating the path is
 * then just an env change + redeploy, no code change.
 */
export default async function AdminBasePathLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ adminBasePath: string }>;
}) {
  const { adminBasePath } = await params;
  if (adminBasePath !== env.ADMIN_BASE_PATH) notFound();
  return <>{children}</>;
}

// Never index the admin area.
export const metadata = { robots: { index: false, follow: false } };
