'use client';

import { useActionState, useState } from 'react';
import type { MediaAsset, Offer } from '@prisma/client';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { DURATION_UNITS, CURRENCIES } from '@/lib/offers';
import { MediaPicker } from '@/components/admin/media-picker';
import { CheckboxRow, FormActions, FormError } from '@/components/admin/form-shell';
import type { FormResult } from '@/app/[adminBasePath]/(dashboard)/offers/actions';

/**
 * Offer form. `kind` decides which tab the offer lands under, and re-labels the
 * shared fields to match that card shape (diagnostic vs formation), so the admin
 * sees the same vocabulary as the public section.
 */
export function OfferForm({
  action,
  cancelHref,
  offer,
  imageAsset,
}: {
  action: (state: FormResult, formData: FormData) => Promise<FormResult>;
  cancelHref: string;
  offer?: Offer | null;
  imageAsset?: MediaAsset | null;
}) {
  const [state, formAction] = useActionState<FormResult, FormData>(action, {});
  const [kind, setKind] = useState<string>(offer?.kind ?? 'diagnostic');
  const isDiag = kind === 'diagnostic';

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormError>{state.error}</FormError>

      <Field label="Type" htmlFor="kind" required hint="Détermine l'onglet où l'offre apparaît.">
        <Select id="kind" name="kind" value={kind} onChange={(e) => setKind(e.target.value)}>
          <option value="diagnostic">Diagnostic</option>
          <option value="formation">Formation</option>
        </Select>
      </Field>

      <Field label="Nom de l'offre" htmlFor="name" required>
        <Input id="name" name="name" defaultValue={offer?.name} required />
      </Field>

      <Field label="Description" required>
        <RichTextEditor name="description" defaultValue={offer?.description ?? ''} />
      </Field>

      <Field
        label={isDiag ? 'Ce qui est inclus (une par ligne)' : 'Modules (un par ligne)'}
        htmlFor="deliverables"
      >
        <Textarea
          id="deliverables"
          name="deliverables"
          defaultValue={offer?.deliverables.join('\n')}
          placeholder={
            isDiag
              ? 'Analyse de vos profils\nBenchmark concurrentiel\nRapport écrit'
              : 'Fondamentaux du CM\nAnimation de communauté\nGestion de crise'
          }
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label={isDiag ? 'Badge (coin supérieur)' : 'Niveau'}
          htmlFor="badge"
          hint={isDiag ? 'Ex : Individuel' : 'Ex : Débutant → Intermédiaire'}
        >
          <Input id="badge" name="badge" defaultValue={offer?.badge ?? ''} />
        </Field>

        <Field label="Durée" htmlFor="durationValue" hint="Quantité + unité (optionnel).">
          <div className="flex gap-2">
            <Input
              id="durationValue"
              name="durationValue"
              type="number"
              min={1}
              step={1}
              placeholder="Ex : 7"
              defaultValue={offer?.durationValue ?? ''}
              className="w-24"
            />
            <Select
              name="durationUnit"
              defaultValue={offer?.durationUnit ?? ''}
              aria-label="Unité de durée"
              className="flex-1"
            >
              <option value="">Unité…</option>
              {DURATION_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </Select>
          </div>
        </Field>
      </div>

      <Field label="Prix" htmlFor="priceAmount" hint="Montant + devise (optionnel).">
        <div className="flex gap-2">
          <Input
            id="priceAmount"
            name="priceAmount"
            type="number"
            min={0}
            step={1}
            placeholder="Ex : 500"
            defaultValue={offer?.priceAmount ?? ''}
            className="w-40"
          />
          <Select
            name="priceCurrency"
            defaultValue={offer?.priceCurrency ?? ''}
            aria-label="Devise"
            className="w-32"
          >
            <option value="">Devise…</option>
            {CURRENCIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.value}
              </option>
            ))}
          </Select>
        </div>
      </Field>

      <MediaPicker name="imageId" label="Image (optionnelle)" defaultAsset={imageAsset} />

      <Field label="Ordre" htmlFor="order" hint="Plus petit = plus haut.">
        <Input
          id="order"
          name="order"
          type="number"
          defaultValue={offer?.order ?? 0}
          className="w-28"
        />
      </Field>

      <CheckboxRow
        name="visible"
        label="Visible sur le site"
        defaultChecked={offer?.visible ?? true}
      />

      <FormActions cancelHref={cancelHref} />
    </form>
  );
}
