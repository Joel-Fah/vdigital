'use client';

import { useActionState, useState } from 'react';
import type { MediaAsset, Offer } from '@prisma/client';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
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
          <option value="diagnostic">🔍 Diagnostic</option>
          <option value="formation">🎓 Formation</option>
        </Select>
      </Field>

      <Field label="Nom de l'offre" htmlFor="name" required>
        <Input id="name" name="name" defaultValue={offer?.name} required />
      </Field>

      <Field label="Description" htmlFor="description" required>
        <Textarea id="description" name="description" defaultValue={offer?.description} required />
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
        <Field
          label={isDiag ? 'Durée' : 'Métadonnées (séparées par des virgules)'}
          htmlFor="duration"
          hint={isDiag ? 'Ex : ⏱ 5–7 jours ouvrés' : 'Ex : Présentiel / Distanciel, 2 jours'}
        >
          <Input id="duration" name="duration" defaultValue={offer?.duration ?? ''} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Emoji" htmlFor="icon" hint="Un seul caractère, ex : 🌐">
          <Input id="icon" name="icon" defaultValue={offer?.icon ?? ''} className="w-24" />
        </Field>
        <Field label="Note de prix" htmlFor="priceNote" hint="Ex : À partir de 500€">
          <Input id="priceNote" name="priceNote" defaultValue={offer?.priceNote ?? ''} />
        </Field>
      </div>

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
