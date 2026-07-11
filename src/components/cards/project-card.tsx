import Link from 'next/link';
import Image from 'next/image';
import type { MediaAsset, Project } from '@prisma/client';
import { TagPill } from '@/components/ui/tag-pill';
import { StatBlock } from '@/components/ui/stat-block';
import { stripHtml } from '@/lib/utils';

type ProjectWithCover = Project & { coverImage: MediaAsset | null };
type Result = { label: string; value: string; trend?: string };

/**
 * ProjectCard (summary) — original `.case-card`. Clicking opens the shared
 * right-side drawer via the `?project=<slug>` query param (Section 5.3), which
 * keeps scroll position and makes the URL shareable. `index` drives the big
 * ghost number in the header.
 */
export function ProjectCard({ project, index }: { project: ProjectWithCover; index: number }) {
  const results = (project.resultsJson as Result[] | null)?.slice(0, 4) ?? [];
  return (
    <Link
      href={`?project=${project.slug}`}
      scroll={false}
      className="group block overflow-hidden rounded-lg border border-line bg-surface-white transition-shadow duration-200 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
      aria-label={`Voir l'étude de cas : ${project.title}`}
    >
      <div className="flex items-center gap-6 border-b border-line bg-teal-ultra px-6 py-5">
        <span className="min-w-[44px] font-display text-[2.2rem] font-bold text-teal/20">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="flex-1">
          <p className="font-display text-[1.2rem] font-bold text-ink">{project.title}</p>
          {(project.client || project.category) && (
            <p className="mt-0.5 text-[0.78rem] text-ink-muted">
              {[project.client, project.category].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
        {project.category && (
          <span className="hidden rounded border border-teal/20 bg-teal/10 px-3 py-1 text-[0.62rem] uppercase tracking-wide text-teal sm:inline-block">
            {project.category}
          </span>
        )}
      </div>

      {project.coverImage && (
        <div className="relative aspect-[16/7] w-full overflow-hidden bg-teal-ultra">
          <Image
            src={project.coverImage.url}
            alt={project.coverImage.altText ?? project.title}
            fill
            sizes="(max-width: 768px) 100vw, 700px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}

      <div className="p-6">
        <p className="mb-4 line-clamp-3 border-l-2 border-teal pl-4 text-[0.85rem] leading-relaxed text-ink-mid">
          {stripHtml(project.summary)}
        </p>
        {results.length > 0 && (
          <div className="grid-lines mb-4 grid grid-cols-2 overflow-hidden rounded-md sm:grid-cols-4">
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
      </div>
    </Link>
  );
}
