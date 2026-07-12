'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
import {
  contactSchema,
  type ContactInput,
  CONTACT_SUBJECTS,
  OTHER_SUBJECT,
} from '@/lib/validation/contact';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Turnstile } from '@/components/ui/turnstile';

/**
 * ContactForm — React Hook Form + Zod (shared schema with the API route).
 * Subject is a predefined list; choosing "Autre" reveals a free-text field and
 * focuses it. Includes an optional WhatsApp number, a honeypot, and Turnstile.
 */
export function ContactForm({ turnstileSiteKey }: { turnstileSiteKey?: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [serverError, setServerError] = useState<string | null>(null);
  const [token, setToken] = useState('');
  const [subjectChoice, setSubjectChoice] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const isOther = subjectChoice === OTHER_SUBJECT;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: ContactInput) {
    const finalSubject = isOther ? customSubject.trim() : subjectChoice;
    if (!finalSubject) {
      setServerError('Merci de choisir un sujet.');
      return;
    }
    setStatus('sending');
    setServerError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, subject: finalSubject, turnstileToken: token }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Une erreur est survenue.');
      }
      setStatus('sent');
      reset();
      setSubjectChoice('');
      setCustomSubject('');
    } catch (err) {
      setStatus('error');
      setServerError(err instanceof Error ? err.message : 'Une erreur est survenue.');
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-teal" />
        <p className="text-[0.95rem] font-medium text-ink">Message envoyé — merci !</p>
        <p className="max-w-sm text-[0.83rem] text-ink-muted">
          Je vous répondrai dans les plus brefs délais.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-xl space-y-4 text-left">
      {/* Honeypot — hidden from users, must stay empty. */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0"
        {...register('company')}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nom" htmlFor="name" required error={errors.name?.message}>
          <Input id="name" placeholder="Votre nom" {...register('name')} />
        </Field>
        <Field label="Email" htmlFor="email" required error={errors.email?.message}>
          <Input id="email" type="email" placeholder="vous@exemple.com" {...register('email')} />
        </Field>
      </div>

      <Field
        label="WhatsApp"
        htmlFor="whatsapp"
        hint="Optionnel — pour un retour plus rapide."
        error={errors.whatsapp?.message}
      >
        <Input id="whatsapp" placeholder="+237 6 00 00 00 00" {...register('whatsapp')} />
      </Field>

      <Field label="Sujet" htmlFor="subject" required>
        <Select
          id="subject"
          value={subjectChoice}
          onChange={(e) => setSubjectChoice(e.target.value)}
        >
          <option value="">Choisir un sujet…</option>
          {CONTACT_SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </Field>

      {isOther && (
        <Field label="Précisez le sujet" htmlFor="customSubject" required>
          <Input
            id="customSubject"
            autoFocus
            placeholder="Votre sujet"
            value={customSubject}
            onChange={(e) => setCustomSubject(e.target.value)}
          />
        </Field>
      )}

      <Field label="Message" htmlFor="message" required error={errors.message?.message}>
        <Textarea id="message" placeholder="Parlez-moi de votre projet…" {...register('message')} />
      </Field>

      <Turnstile siteKey={turnstileSiteKey} onVerify={setToken} />

      {serverError && <p className="text-[0.8rem] text-red-600">{serverError}</p>}

      <Button type="submit" variant="primary" disabled={status === 'sending'} className="w-full">
        {status === 'sending' ? 'Envoi…' : 'Envoyer le message'}
      </Button>
    </form>
  );
}
