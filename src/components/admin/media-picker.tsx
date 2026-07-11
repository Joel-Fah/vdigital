'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ImageIcon, X, UploadCloud } from 'lucide-react';
import type { MediaAsset } from '@prisma/client';
import { Field, Input, Label } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { uploadMediaAction } from '@/app/[adminBasePath]/(dashboard)/media/actions';

/**
 * MediaPicker — pick an existing MediaAsset from the library OR upload a new one
 * without leaving the form (v1.0). Renders a hidden input carrying the selected
 * id so it plugs into a plain <form>.
 */
export function MediaPicker({
  name,
  label,
  defaultAsset,
}: {
  name: string;
  label: string;
  defaultAsset?: MediaAsset | null;
}) {
  const [selected, setSelected] = useState<MediaAsset | null>(defaultAsset ?? null);
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || assets.length) return;
    setLoading(true);
    fetch('/api/admin/media')
      .then((r) => r.json())
      .then((d) => setAssets(d.items ?? []))
      .finally(() => setLoading(false));
  }, [open, assets.length]);

  async function onUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploadError(null);
    setUploading(true);
    const form = e.currentTarget;
    const res = await uploadMediaAction(new FormData(form));
    setUploading(false);
    if (!res.ok || !res.asset) {
      setUploadError(res.error ?? 'Échec du téléversement.');
      return;
    }
    // Prepend, select, and close.
    setAssets((prev) => [res.asset!, ...prev]);
    setSelected(res.asset);
    form.reset();
    setOpen(false);
  }

  return (
    <div>
      <Label>{label}</Label>
      <input type="hidden" name={name} value={selected?.id ?? ''} />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border border-line bg-teal-ultra text-ink-muted hover:border-teal"
        >
          {selected ? (
            <Image
              src={selected.url}
              alt={selected.altText ?? ''}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <ImageIcon className="h-5 w-5" />
          )}
        </button>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-[0.78rem] text-teal hover:underline"
          >
            {selected ? 'Changer' : 'Choisir ou téléverser'}
          </button>
          {selected && (
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-left text-[0.72rem] text-ink-muted hover:text-red-600"
            >
              Retirer
            </button>
          )}
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-ink/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-surface-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-[1.05rem] font-bold text-ink">Médiathèque</h3>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="text-ink-muted hover:text-teal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Inline upload — add a new image without leaving the form */}
            <form
              onSubmit={onUpload}
              className="mb-5 rounded-md border border-dashed border-line bg-surface-off p-4"
            >
              <div className="mb-2 flex items-center gap-2 text-[0.8rem] font-medium text-ink">
                <UploadCloud className="h-4 w-4 text-teal" /> Téléverser une nouvelle image
              </div>
              <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                <Field label="Fichier" htmlFor="mp-file" required>
                  <Input id="mp-file" name="file" type="file" accept="image/*" required />
                </Field>
                <Field label="Texte alternatif" htmlFor="mp-alt" required>
                  <Input id="mp-alt" name="altText" placeholder="Description" required />
                </Field>
                <Button type="submit" variant="primary" size="sm" disabled={uploading}>
                  {uploading ? '…' : 'Téléverser'}
                </Button>
              </div>
              {uploadError && <p className="mt-2 text-[0.75rem] text-red-600">{uploadError}</p>}
            </form>

            {loading ? (
              <p className="py-8 text-center text-[0.83rem] text-ink-muted">Chargement…</p>
            ) : assets.length === 0 ? (
              <p className="py-8 text-center text-[0.83rem] text-ink-muted">
                Aucun média pour l&apos;instant — téléversez-en un ci-dessus.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {assets.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => {
                      setSelected(a);
                      setOpen(false);
                    }}
                    className={`relative aspect-square overflow-hidden rounded border ${
                      selected?.id === a.id ? 'border-teal ring-2 ring-teal' : 'border-line'
                    }`}
                  >
                    <Image
                      src={a.url}
                      alt={a.altText ?? ''}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
