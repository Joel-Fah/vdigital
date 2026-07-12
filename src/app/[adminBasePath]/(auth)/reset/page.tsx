import Image from 'next/image';
import Link from 'next/link';
import { randomPexels, pexelsUrl } from '@/lib/pexels-curated';
import { validateResetToken } from '@/lib/password-reset';
import { adminPath } from '@/lib/admin';
import { ResetForm } from './reset-form';

export const metadata = { title: 'Nouveau mot de passe', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function ResetPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const email = token ? await validateResetToken(token) : null;
  const bg = randomPexels();

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <Image
        src={pexelsUrl(bg, 1600)}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(13,79,79,0.92), rgba(27,122,122,0.78))',
        }}
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-display text-[1.6rem] font-bold text-white">
            V<span className="text-teal-light">DIGITAL</span>
          </span>
          <p className="mt-1 text-[0.75rem] uppercase tracking-label text-white/70">
            Nouveau mot de passe
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-surface-white/95 p-8 shadow-card backdrop-blur">
          {email && token ? (
            <ResetForm token={token} loginHref={adminPath()} />
          ) : (
            <div className="text-center">
              <p className="text-[0.9rem] font-medium text-ink">Lien invalide ou expiré</p>
              <p className="mt-1 text-[0.8rem] text-ink-muted">
                Ce lien de réinitialisation n'est plus valable.
              </p>
              <Link
                href={adminPath('forgot')}
                className="mt-4 inline-block text-[0.8rem] font-medium text-teal hover:underline"
              >
                Refaire une demande
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
