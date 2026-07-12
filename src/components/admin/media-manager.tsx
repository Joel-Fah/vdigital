'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { UploadCloud, Search, Trash2, X } from 'lucide-react';
import type { MediaAsset } from '@prisma/client';
import { Field, Input, Label } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import {
  uploadMediaAction,
  importPexelsAction,
  deleteMediaAction,
} from '@/app/[adminBasePath]/(dashboard)/media/actions';
import { CURATED_PEXELS, pexelsUrl, type CuratedPhoto } from '@/lib/pexels-curated';

/** Media library UI (Section 6 admin empty state, Section 7 Pexels). */
export function MediaManager({
  assets,
  r2Enabled,
  pexelsEnabled,
}: {
  assets: MediaAsset[];
  r2Enabled: boolean;
  pexelsEnabled: boolean;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [pexelsOpen, setPexelsOpen] = useState(false);

  async function onUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const res = await uploadMediaAction(form);
    if (!res.ok) setError(res.error ?? 'Échec.');
    else (e.target as HTMLFormElement).reset();
  }

  return (
    <div className="space-y-8">
      {/* Upload */}
      <form onSubmit={onUpload} className="rounded-lg border border-line bg-surface-white p-5">
        <div className="mb-3 flex items-center gap-2 text-[0.85rem] font-medium text-ink">
          <UploadCloud className="h-4 w-4 text-teal" /> Téléverser une image
        </div>
        {!r2Enabled && (
          <p className="mb-3 rounded bg-gold/10 px-3 py-2 text-[0.75rem] text-ink-mid">
            Le stockage R2 n'est pas configuré — le téléversement est désactivé. Vous pouvez
            toujours importer des images Pexels.
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="space-y-3">
            <Field label="Fichier" htmlFor="file" required>
              <Input
                id="file"
                name="file"
                type="file"
                accept="image/*"
                required
                disabled={!r2Enabled}
              />
            </Field>
            <Field label="Texte alternatif (obligatoire)" htmlFor="altText" required>
              <Input
                id="altText"
                name="altText"
                placeholder="Description de l'image"
                required
                disabled={!r2Enabled}
              />
            </Field>
          </div>
          <Button type="submit" variant="primary" size="sm" disabled={!r2Enabled || pending}>
            Téléverser
          </Button>
        </div>
        {error && <p className="mt-2 text-[0.78rem] text-red-600">{error}</p>}

        {pexelsEnabled && (
          <button
            type="button"
            onClick={() => setPexelsOpen(true)}
            className="mt-4 inline-flex items-center gap-2 text-[0.8rem] text-teal hover:underline"
          >
            <Search className="h-3.5 w-3.5" /> ou ajouter une image Pexels (libre de droits)
          </button>
        )}
      </form>

      {/* Grid */}
      {assets.length === 0 ? (
        <EmptyState
          variant="admin"
          icon={<UploadCloud className="h-8 w-8" strokeWidth={1.25} />}
          message="Aucun média pour le moment. Téléversez une image, ou ajoutez un visuel Pexels."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {assets.map((a) => (
            <div
              key={a.id}
              className="group relative overflow-hidden rounded-md border border-line bg-surface-white"
            >
              <div className="relative aspect-square bg-teal-ultra">
                <Image
                  src={a.url}
                  alt={a.altText ?? ''}
                  fill
                  sizes="240px"
                  className="object-cover"
                />
                {a.source === 'pexels' && (
                  <span className="absolute left-1.5 top-1.5 rounded bg-gold/90 px-1.5 py-0.5 text-[0.6rem] font-medium uppercase text-white">
                    Pexels
                  </span>
                )}
                <button
                  onClick={() => {
                    if (confirm('Supprimer ce média ?'))
                      start(() => deleteMediaAction(a.id).then(() => {}));
                  }}
                  className="absolute right-1.5 top-1.5 rounded bg-white/90 p-1.5 text-red-600 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Supprimer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="p-2">
                <p className="truncate text-[0.7rem] text-ink-muted" title={a.altText ?? ''}>
                  {a.altText ?? 'Sans description'}
                </p>
                {a.pexelsCredit && (
                  <p className="truncate text-[0.62rem] text-ink-light">© {a.pexelsCredit}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {pexelsOpen && <PexelsSearch onClose={() => setPexelsOpen(false)} />}
    </div>
  );
}

/** Curated free-Pexels picker — no API, just a fixed set of on-theme images. */
function PexelsSearch({ onClose }: { onClose: () => void }) {
  const [pending, start] = useTransition();

  function attach(p: CuratedPhoto) {
    start(() =>
      importPexelsAction({
        pexelsId: p.id,
        url: pexelsUrl(p, 1260),
        altText: p.alt,
        credit: 'Pexels',
      }).then(() => onClose()),
    );
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-ink/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-surface-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-[1.1rem] font-bold text-ink">
            Images Pexels (libres de droits)
          </h3>
          <button onClick={onClose} aria-label="Fermer" className="text-ink-muted hover:text-teal">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CURATED_PEXELS.map((p) => (
            <button
              key={p.id}
              onClick={() => attach(p)}
              disabled={pending}
              className="group relative aspect-square overflow-hidden rounded border border-line disabled:opacity-50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pexelsUrl(p, 400)} alt={p.alt} className="h-full w-full object-cover" />
              <span className="absolute inset-0 flex items-center justify-center bg-teal/0 text-[0.7rem] font-medium text-white opacity-0 transition-all group-hover:bg-teal/60 group-hover:opacity-100">
                Ajouter
              </span>
            </button>
          ))}
        </div>
        <Label className="mt-4">
          Les images Pexels sont provisoires (à remplacer par vos vrais visuels).
        </Label>
      </div>
    </div>
  );
}
