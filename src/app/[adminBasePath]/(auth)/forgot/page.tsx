import Image from 'next/image';
import Link from 'next/link';
import { env } from '@/lib/env';
import { randomPexels, pexelsUrl } from '@/lib/pexels-curated';
import { adminPath } from '@/lib/admin';
import { ForgotForm } from './forgot-form';

export const metadata = { title: 'Mot de passe oublié', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function ForgotPage() {
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
            Réinitialiser le mot de passe
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-surface-white/95 p-8 shadow-card backdrop-blur">
          <ForgotForm turnstileSiteKey={env.turnstile.siteKey} />
          <Link
            href={adminPath()}
            className="mt-4 block text-center text-[0.78rem] text-ink-muted hover:text-teal"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
