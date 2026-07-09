'use client';

import { useActionState } from 'react';
import type { MediaAsset, Testimonial } from '@prisma/client';
import { Field, Input, Textarea } from '@/components/ui/field';
import { MediaPicker } from '@/components/admin/media-picker';
import { CheckboxRow, FormActions, FormError } from '@/components/admin/form-shell';
import type { FormResult } from '@/app/[adminBasePath]/(dashboard)/testimonials/actions';

export function TestimonialForm({
  action,
  cancelHref,
  testimonial,
  photoAsset,
}: {
  action: (state: FormResult, formData: FormData) => Promise<FormResult>;
  cancelHref: string;
  testimonial?: Testimonial | null;
  photoAsset?: MediaAsset | null;
}) {
  const [state, formAction] = useActionState<FormResult, FormData>(action, {});
  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormError>{state.error}</FormError>
      <Field label="Citation" htmlFor="quote" required>
        <Textarea id="quote" name="quote" defaultValue={testimonial?.quote} required />
      </Field>
      <Field label="Auteur" htmlFor="author" required>
        <Input id="author" name="author" defaultValue={testimonial?.author} required />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Rôle" htmlFor="role">
          <Input id="role" name="role" defaultValue={testimonial?.role ?? ''} />
        </Field>
        <Field label="Entreprise" htmlFor="company">
          <Input id="company" name="company" defaultValue={testimonial?.company ?? ''} />
        </Field>
      </div>
      <MediaPicker name="photoId" label="Photo (optionnelle)" defaultAsset={photoAsset} />
      <Field label="Ordre" htmlFor="order">
        <Input
          id="order"
          name="order"
          type="number"
          defaultValue={testimonial?.order ?? 0}
          className="w-28"
        />
      </Field>
      <CheckboxRow
        name="visible"
        label="Visible sur le site"
        defaultChecked={testimonial?.visible ?? true}
      />
      <FormActions cancelHref={cancelHref} />
    </form>
  );
}
