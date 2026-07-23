'use client';

import { useActionState } from 'react';
import type { MediaAsset, Project } from '@prisma/client';
import { Field, Input, Textarea } from '@/components/ui/field';
import { ChipsInput } from '@/components/ui/chips-input';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Combobox } from '@/components/ui/combobox';
import { MediaPicker } from '@/components/admin/media-picker';
import { MediaGalleryPicker } from '@/components/admin/media-gallery-picker';
import { CheckboxRow, FormActions, FormError } from '@/components/admin/form-shell';
import type { FormResult } from '@/app/[adminBasePath]/(dashboard)/projects/actions';

type Result = { label: string; value: string; trend?: string };

export function ProjectForm({
  action,
  cancelHref,
  project,
  coverAsset,
  categories = [],
  clients = [],
}: {
  action: (state: FormResult, formData: FormData) => Promise<FormResult>;
  cancelHref: string;
  project?: (Project & { gallery?: MediaAsset[] }) | null;
  coverAsset?: MediaAsset | null;
  categories?: string[];
  clients?: string[];
}) {
  const [state, formAction] = useActionState<FormResult, FormData>(action, {});
  const results = (project?.resultsJson as Result[] | null) ?? [];
  const resultsText = results
    .map((r) => [r.label, r.value, r.trend].filter(Boolean).join(' | '))
    .join('\n');

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <FormError>{state.error}</FormError>

      <Field label="Titre" htmlFor="title" required>
        <Input id="title" name="title" defaultValue={project?.title} required />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Client"
          htmlFor="client"
          hint="Choisissez un client existant ou saisissez-en un nouveau."
        >
          <Combobox
            id="client"
            name="client"
            options={clients}
            defaultValue={project?.client ?? ''}
            placeholder="ex : BAO Supermarché"
          />
        </Field>
        <Field
          label="Catégorie"
          htmlFor="category"
          hint="Choisissez une catégorie existante ou saisissez-en une nouvelle."
        >
          <Combobox
            id="category"
            name="category"
            options={categories}
            defaultValue={project?.category ?? ''}
            placeholder="ex : Grande distribution"
          />
        </Field>
      </div>

      <Field
        label="Résumé / mission"
        required
        tooltip="Décrivez le contexte et la mission : le défi du client, votre rôle, l'approche. Mise en forme possible (gras, listes, liens). C'est le texte principal affiché dans le tiroir du projet."
      >
        <RichTextEditor name="summary" defaultValue={project?.summary ?? ''} />
      </Field>

      <Field
        label="Résultats (une ligne par KPI : libellé | valeur | tendance)"
        htmlFor="results"
        hint="Ex : Engagement | +180% | vs. année précédente"
      >
        <Textarea
          id="results"
          name="results"
          defaultValue={resultsText}
          placeholder="Vues | 1,6M&#10;Engagement | +180%"
        />
      </Field>

      <Field label="Tags" hint="Entrée ou virgule pour ajouter un tag.">
        <ChipsInput name="tags" defaultValue={project?.tags ?? []} placeholder="ex : Instagram" />
      </Field>

      <Field label="Lien externe" htmlFor="link">
        <Input
          id="link"
          name="link"
          type="url"
          defaultValue={project?.link ?? ''}
          placeholder="https://"
        />
      </Field>

      <MediaPicker name="coverImageId" label="Image de couverture" defaultAsset={coverAsset} />
      <MediaGalleryPicker
        name="galleryIds"
        label="Galerie du projet"
        defaultAssets={project?.gallery ?? []}
      />

      <Field label="Ordre" htmlFor="order" hint="Plus petit = plus haut dans la liste.">
        <Input
          id="order"
          name="order"
          type="number"
          defaultValue={project?.order ?? 0}
          className="w-28"
        />
      </Field>

      <div className="space-y-2.5">
        <CheckboxRow
          name="featured"
          label="Mis en avant"
          hint="Apparaît dans le teaser de la page d'accueil."
          defaultChecked={project?.featured ?? false}
        />
        <CheckboxRow
          name="visible"
          label="Visible sur le site"
          defaultChecked={project?.visible ?? true}
        />
      </div>

      <FormActions cancelHref={cancelHref} />
    </form>
  );
}
