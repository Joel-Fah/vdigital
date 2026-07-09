'use client';

import { useActionState } from 'react';
import type { ClientLogo, MediaAsset } from '@prisma/client';
import { Field, Input } from '@/components/ui/field';
import { MediaPicker } from '@/components/admin/media-picker';
import { CheckboxRow, FormActions, FormError } from '@/components/admin/form-shell';
import type { FormResult } from '@/app/[adminBasePath]/(dashboard)/clients/actions';

export function ClientForm({
  action,
  cancelHref,
  client,
  logoAsset,
}: {
  action: (state: FormResult, formData: FormData) => Promise<FormResult>;
  cancelHref: string;
  client?: ClientLogo | null;
  logoAsset?: MediaAsset | null;
}) {
  const [state, formAction] = useActionState<FormResult, FormData>(action, {});
  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormError>{state.error}</FormError>
      <Field label="Nom" htmlFor="name" required>
        <Input id="name" name="name" defaultValue={client?.name} required />
      </Field>
      <Field label="Secteur" htmlFor="sector">
        <Input id="sector" name="sector" defaultValue={client?.sector ?? ''} />
      </Field>
      <Field label="Lien" htmlFor="link">
        <Input
          id="link"
          name="link"
          type="url"
          defaultValue={client?.link ?? ''}
          placeholder="https://"
        />
      </Field>
      <MediaPicker name="logoId" label="Logo (optionnel)" defaultAsset={logoAsset} />
      <Field label="Ordre" htmlFor="order">
        <Input
          id="order"
          name="order"
          type="number"
          defaultValue={client?.order ?? 0}
          className="w-28"
        />
      </Field>
      <CheckboxRow
        name="visible"
        label="Visible sur le site"
        defaultChecked={client?.visible ?? true}
      />
      <FormActions cancelHref={cancelHref} />
    </form>
  );
}
