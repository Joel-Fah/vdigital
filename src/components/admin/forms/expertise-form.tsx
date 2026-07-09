'use client';

import { useActionState } from 'react';
import type { ExpertiseItem } from '@prisma/client';
import { Field, Input } from '@/components/ui/field';
import { CheckboxRow, FormActions, FormError } from '@/components/admin/form-shell';
import type { FormResult } from '@/app/[adminBasePath]/(dashboard)/expertise/actions';

export function ExpertiseForm({
  action,
  cancelHref,
  item,
}: {
  action: (state: FormResult, formData: FormData) => Promise<FormResult>;
  cancelHref: string;
  item?: ExpertiseItem | null;
}) {
  const [state, formAction] = useActionState<FormResult, FormData>(action, {});
  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormError>{state.error}</FormError>
      <Field label="Compétence" htmlFor="name" required>
        <Input id="name" name="name" defaultValue={item?.name} required />
      </Field>
      <Field label="Description (optionnelle)" htmlFor="description">
        <Input id="description" name="description" defaultValue={item?.description ?? ''} />
      </Field>
      <Field label="Niveau (0–100)" htmlFor="level" required hint="Pilote la barre de progression.">
        <Input
          id="level"
          name="level"
          type="number"
          min={0}
          max={100}
          defaultValue={item?.level ?? 80}
          className="w-28"
          required
        />
      </Field>
      <Field label="Ordre" htmlFor="order">
        <Input
          id="order"
          name="order"
          type="number"
          defaultValue={item?.order ?? 0}
          className="w-28"
        />
      </Field>
      <CheckboxRow
        name="visible"
        label="Visible sur le site"
        defaultChecked={item?.visible ?? true}
      />
      <FormActions cancelHref={cancelHref} />
    </form>
  );
}
