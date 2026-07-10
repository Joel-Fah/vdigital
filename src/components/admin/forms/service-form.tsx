'use client';

import { useActionState } from 'react';
import type { MediaAsset, Service } from '@prisma/client';
import { Field, Input, Textarea } from '@/components/ui/field';
import { ChipsInput } from '@/components/ui/chips-input';
import { MediaPicker } from '@/components/admin/media-picker';
import { CheckboxRow, FormActions, FormError } from '@/components/admin/form-shell';
import type { FormResult } from '@/app/[adminBasePath]/(dashboard)/services/actions';

export function ServiceForm({
  action,
  cancelHref,
  service,
  iconAsset,
}: {
  action: (state: FormResult, formData: FormData) => Promise<FormResult>;
  cancelHref: string;
  service?: Service | null;
  iconAsset?: MediaAsset | null;
}) {
  const [state, formAction] = useActionState<FormResult, FormData>(action, {});
  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormError>{state.error}</FormError>

      <Field label="Titre" htmlFor="title" required>
        <Input id="title" name="title" defaultValue={service?.title} required />
      </Field>

      <Field label="Description" htmlFor="description" required>
        <Textarea
          id="description"
          name="description"
          defaultValue={service?.description}
          required
        />
      </Field>

      <Field label="Tags" hint="Entrée ou virgule pour ajouter un tag.">
        <ChipsInput name="tags" defaultValue={service?.tags ?? []} placeholder="ex : Modération" />
      </Field>

      <MediaPicker name="iconId" label="Icône (optionnelle)" defaultAsset={iconAsset} />

      <Field label="Ordre" htmlFor="order" hint="Plus petit = plus haut.">
        <Input
          id="order"
          name="order"
          type="number"
          defaultValue={service?.order ?? 0}
          className="w-28"
        />
      </Field>

      <div className="space-y-2.5">
        <CheckboxRow
          name="featured"
          label="Mis en avant"
          hint="Teaser page d'accueil."
          defaultChecked={service?.featured ?? false}
        />
        <CheckboxRow
          name="visible"
          label="Visible sur le site"
          defaultChecked={service?.visible ?? true}
        />
      </div>

      <FormActions cancelHref={cancelHref} />
    </form>
  );
}
