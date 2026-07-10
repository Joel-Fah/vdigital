import Image from 'next/image';
import { env } from '@/lib/env';
import { randomPexels, pexelsUrl } from '@/lib/pexels-curated';
import { LoginForm } from './login-form';

export const metadata = {
  title: 'Connexion',
  robots: { index: false, follow: false },
};

// Re-pick the background on each request (this route is dynamic anyway).
export const dynamic = 'force-dynamic';

/** Admin login — obscured base path root (Section 8.2), on a Pexels backdrop. */
export default function LoginPage() {
  const bg = randomPexels();
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      {/* Random curated Pexels backdrop + teal wash for legibility (no API). */}
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
            Espace d&apos;administration
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-surface-white/95 p-8 shadow-card backdrop-blur">
          <LoginForm turnstileSiteKey={env.turnstile.siteKey} />
        </div>
      </div>
    </div>
  );
}
