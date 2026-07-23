'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { ImageIcon, X } from 'lucide-react';
import type { MediaAsset } from '@prisma/client';
import { Label } from '@/components/ui/field';

/** Select and order multiple existing media assets for a project's public gallery. */
export function MediaGalleryPicker({
  name,
  label,
  defaultAssets = [],
}: {
  name: string;
  label: string;
  defaultAssets?: MediaAsset[];
}) {
  const [selected, setSelected] = useState<MediaAsset[]>(defaultAssets);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open || assets.length) return;
    setLoading(true);
    fetch('/api/admin/media')
      .then((response) => response.json())
      .then((data) => setAssets(data.items ?? []))
      .finally(() => setLoading(false));
  }, [open, assets.length]);

  function toggle(asset: MediaAsset) {
    setSelected((current) =>
      current.some((item) => item.id === asset.id)
        ? current.filter((item) => item.id !== asset.id)
        : [...current, asset],
    );
  }

  return (
    <div>
      <Label>{label}</Label>
      {selected.map((asset) => (
        <input key={asset.id} type="hidden" name={name} value={asset.id} />
      ))}
      <div className="mt-1 flex flex-wrap gap-2">
        {selected.length ? (
          selected.map((asset) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => toggle(asset)}
              className="relative h-16 w-16 overflow-hidden rounded border border-line hover:border-red-600"
              aria-label="Retirer cette image de la galerie"
            >
              <Image
                src={asset.url}
                alt={asset.altText ?? ''}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))
        ) : (
          <span className="flex h-16 w-16 items-center justify-center rounded border border-dashed border-line bg-surface-off text-ink-light">
            <ImageIcon className="h-5 w-5" />
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-2 text-[0.78rem] text-teal hover:underline"
      >
        {selected.length ? `Modifier les ${selected.length} images` : 'Choisir des images'}
      </button>

      {open &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[300] flex items-center justify-center bg-ink/40 p-4"
            onClick={() => setOpen(false)}
          >
            <div
              className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-surface-white p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-[1.05rem] font-bold text-ink">
                    Galerie du projet
                  </h3>
                  <p className="text-[0.75rem] text-ink-muted">
                    SÃ©lectionnez jusqu’Ã  12 images dans la mÃ©diathÃ¨que.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-[0.75rem] font-medium text-teal hover:underline"
                  >
                    Terminer ({selected.length})
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Fermer"
                    className="text-ink-muted hover:text-teal"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {loading ? (
                <p className="py-8 text-center text-[0.83rem] text-ink-muted">Chargement…</p>
              ) : assets.length === 0 ? (
                <p className="py-8 text-center text-[0.83rem] text-ink-muted">
                  Ajoutez d’abord des images dans la section Médias.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {assets.map((asset) => {
                    const active = selected.some((item) => item.id === asset.id);
                    const limitReached = selected.length >= 12 && !active;
                    return (
                      <button
                        key={asset.id}
                        type="button"
                        disabled={limitReached}
                        onClick={() => toggle(asset)}
                        className={`relative aspect-square overflow-hidden rounded border disabled:cursor-not-allowed disabled:opacity-40 ${
                          active ? 'border-teal ring-2 ring-teal' : 'border-line'
                        }`}
                      >
                        <Image
                          src={asset.url}
                          alt={asset.altText ?? ''}
                          fill
                          sizes="160px"
                          className="object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
