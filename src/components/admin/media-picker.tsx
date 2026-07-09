'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ImageIcon, X } from 'lucide-react';
import type { MediaAsset } from '@prisma/client';
import { Label } from '@/components/ui/field';

/**
 * MediaPicker — pick an existing MediaAsset id from the library, used inside
 * entity forms (cover image, icon, logo, photo…). Renders a hidden input so it
 * plugs straight into a plain <form>. Fetches the library from the admin media
 * API on open.
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

  useEffect(() => {
    if (!open || assets.length) return;
    setLoading(true);
    fetch('/api/admin/media')
      .then((r) => r.json())
      .then((d) => setAssets(d.items ?? []))
      .finally(() => setLoading(false));
  }, [open, assets.length]);

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
            {selected ? 'Changer' : 'Choisir une image'}
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
            className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-surface-white p-6"
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
            {loading ? (
              <p className="py-8 text-center text-[0.83rem] text-ink-muted">Chargement…</p>
            ) : assets.length === 0 ? (
              <p className="py-8 text-center text-[0.83rem] text-ink-muted">
                Aucun média. Ajoutez-en depuis la Médiathèque.
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
