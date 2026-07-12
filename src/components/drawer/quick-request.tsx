'use client';

import { useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Field, Input } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Turnstile } from '@/components/ui/turnstile';

/**
 * QuickRequest — inline request-a-quote flow used inside the offer/service
 * drawer (v1.2). "Demander" reveals email + WhatsApp fields and focuses the
 * email; submitting posts an auto-composed message to /api/contact with the item
 * name as the subject — no trip back to the contact section.
 */
export function QuickRequest({
  itemLabel,
  kind,
  label,
}: {
  itemLabel: string;
  kind: 'offre' | 'service';
  label: string;
}) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);

  function reveal() {
    setOpen(true);
    setTimeout(() => emailRef.current?.focus(), 50);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Merci d’indiquer un email valide.');
      return;
    }
    if (!email && !whatsapp) {
      setError('Indiquez au moins un email ou un numéro WhatsApp.');
      return;
    }
    setStatus('sending');
    setError(null);
    const message =
      `Bonjour, je suis intéressé(e) par ${kind === 'offre' ? "l'offre" : 'le service'} ` +
      `« ${itemLabel} ».${whatsapp ? ` WhatsApp : ${whatsapp}.` : ''} Merci de me recontacter.`;
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          whatsapp,
          subject: `Demande — ${itemLabel}`,
          message,
          turnstileToken: token,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Une erreur est survenue.');
      }
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex items-center gap-2 rounded-md bg-teal-ultra px-4 py-3 text-[0.85rem] text-teal">
        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
        Demande envoyée — je vous recontacte très vite.
      </div>
    );
  }

  if (!open) {
    return (
      <Button type="button" variant="primary" size="sm" onClick={reveal} className="w-full">
        {label}
      </Button>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-md border border-line bg-surface-off p-4">
      <p className="text-[0.8rem] text-ink-mid">
        Laissez vos coordonnées, je vous recontacte au sujet de « {itemLabel} ».
      </p>
      <Field label="Email" htmlFor="qr-email" required>
        <Input
          id="qr-email"
          ref={emailRef}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@exemple.com"
          required
        />
      </Field>
      <Field label="WhatsApp" htmlFor="qr-wa" hint="Optionnel.">
        <Input
          id="qr-wa"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="+237 6 00 00 00 00"
        />
      </Field>

      <Turnstile siteKey={siteKey} onVerify={setToken} />

      {error && <p className="text-[0.78rem] text-red-600">{error}</p>}

      <div className="flex items-center gap-2">
        <Button type="submit" variant="primary" size="sm" disabled={status === 'sending'}>
          {status === 'sending' ? 'Envoi…' : 'Envoyer ma demande'}
        </Button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[0.78rem] text-ink-muted hover:text-teal"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
