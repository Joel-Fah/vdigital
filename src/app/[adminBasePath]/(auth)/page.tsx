import { env } from '@/lib/env';
import { LoginForm } from './login-form';

export const metadata = {
  title: 'Connexion',
  robots: { index: false, follow: false },
};

/** Admin login — lives at the obscured base path root (Section 8.2). */
export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-off px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-display text-[1.6rem] font-bold text-ink">
            V<span className="text-teal">DIGITAL</span>
          </span>
          <p className="mt-1 text-[0.75rem] uppercase tracking-label text-ink-muted">
            Espace d'administration
          </p>
        </div>
        <div className="rounded-lg border border-line bg-surface-white p-8 shadow-soft">
          <LoginForm turnstileSiteKey={env.turnstile.siteKey} />
        </div>
      </div>
    </div>
  );
}
