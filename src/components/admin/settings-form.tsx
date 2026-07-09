'use client';

import { useActionState } from 'react';
import type { SiteSettings } from '@prisma/client';
import { Field, Input, Textarea } from '@/components/ui/field';
import { FormActions, FormError } from '@/components/admin/form-shell';
import {
  updateSettingsAction,
  type FormResult,
} from '@/app/[adminBasePath]/(dashboard)/settings/actions';

export function SettingsForm({
  settings,
  cancelHref,
}: {
  settings: SiteSettings | null;
  cancelHref: string;
}) {
  const [state, formAction] = useActionState<FormResult, FormData>(updateSettingsAction, {});
  const social = (settings?.socialLinks as Record<string, string> | null) ?? {};

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormError>{state.error}</FormError>
      {state.ok && (
        <p className="rounded bg-teal-ultra px-3 py-2 text-[0.8rem] text-teal">
          Réglages enregistrés.
        </p>
      )}

      <fieldset className="space-y-5">
        <legend className="mb-2 text-[0.72rem] uppercase tracking-label text-ink-muted">SEO</legend>
        <Field label="Titre SEO par défaut" htmlFor="seoTitle">
          <Input id="seoTitle" name="seoTitle" defaultValue={settings?.seoTitle ?? ''} />
        </Field>
        <Field label="Description SEO par défaut" htmlFor="seoDescription">
          <Textarea
            id="seoDescription"
            name="seoDescription"
            defaultValue={settings?.seoDescription ?? ''}
          />
        </Field>
      </fieldset>

      <fieldset className="space-y-5 border-t border-line pt-5">
        <legend className="mb-2 text-[0.72rem] uppercase tracking-label text-ink-muted">
          Contact
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email de contact" htmlFor="contactEmail">
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              defaultValue={settings?.contactEmail ?? ''}
            />
          </Field>
          <Field label="Téléphone" htmlFor="contactPhone">
            <Input
              id="contactPhone"
              name="contactPhone"
              defaultValue={settings?.contactPhone ?? ''}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-5 border-t border-line pt-5">
        <legend className="mb-2 text-[0.72rem] uppercase tracking-label text-ink-muted">
          Réseaux sociaux
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Instagram" htmlFor="instagram">
            <Input
              id="instagram"
              name="instagram"
              type="url"
              defaultValue={social.instagram ?? ''}
              placeholder="https://"
            />
          </Field>
          <Field label="LinkedIn" htmlFor="linkedin">
            <Input
              id="linkedin"
              name="linkedin"
              type="url"
              defaultValue={social.linkedin ?? ''}
              placeholder="https://"
            />
          </Field>
          <Field label="TikTok" htmlFor="tiktok">
            <Input
              id="tiktok"
              name="tiktok"
              type="url"
              defaultValue={social.tiktok ?? ''}
              placeholder="https://"
            />
          </Field>
          <Field label="Facebook" htmlFor="facebook">
            <Input
              id="facebook"
              name="facebook"
              type="url"
              defaultValue={social.facebook ?? ''}
              placeholder="https://"
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-5 border-t border-line pt-5">
        <legend className="mb-2 text-[0.72rem] uppercase tracking-label text-ink-muted">
          Analytics
        </legend>
        <Field label="ID Analytics (optionnel)" htmlFor="analyticsId">
          <Input id="analyticsId" name="analyticsId" defaultValue={settings?.analyticsId ?? ''} />
        </Field>
      </fieldset>

      <FormActions cancelHref={cancelHref} submitLabel="Enregistrer les réglages" />
    </form>
  );
}
