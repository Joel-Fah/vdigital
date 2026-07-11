'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import type { MediaAsset, Project } from '@prisma/client';
import { TagPill } from '@/components/ui/tag-pill';
import { StatBlock } from '@/components/ui/stat-block';
import { Button } from '@/components/ui/button';
import { RichText } from '@/components/ui/rich-text';

type ProjectDetail = Project & { coverImage: MediaAsset | null; gallery: MediaAsset[] };
type Result = { label: string; value: string; trend?: string };

/** Full project view inside the drawer (Section 5.3) — everything a detail page implied. */
export function ProjectDrawerContent({ data }: { data: unknown }) {
  const project = data as ProjectDetail;
  const results = (project.resultsJson as Result[] | null) ?? [];
  const images = [project.coverImage, ...project.gallery].filter(
    (m): m is MediaAsset => m !== null,
  );
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-6">
      {(project.client || project.category) && (
        <p className="text-[0.78rem] uppercase tracking-wide text-teal">
          {[project.client, project.category].filter(Boolean).join(' · ')}
        </p>
      )}

      {/* Simple in-drawer gallery/lightbox */}
      {images.length > 0 && (
        <div>
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md bg-teal-ultra">
            <Image
              src={images[active]!.url}
              alt={images[active]!.altText ?? project.title}
              fill
              sizes="480px"
              className="object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActive(i)}
                  className={`relative h-14 w-20 flex-shrink-0 overflow-hidden rounded ${
                    i === active ? 'ring-2 ring-teal' : 'opacity-70'
                  }`}
                  aria-label={`Image ${i + 1}`}
                >
                  <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <RichText html={project.summary} />

      {results.length > 0 && (
        <div className="grid-lines grid grid-cols-2 overflow-hidden rounded-md border border-line">
          {results.map((r, i) => (
            <div key={i} className="bg-teal-ultra p-4">
              <StatBlock value={r.value} label={r.label} trend={r.trend} size="sm" />
            </div>
          ))}
        </div>
      )}

      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <TagPill key={t}>{t}</TagPill>
          ))}
        </div>
      )}

      {project.link && (
        <Button
          href={project.link}
          variant="outline"
          size="sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          Voir le projet <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
