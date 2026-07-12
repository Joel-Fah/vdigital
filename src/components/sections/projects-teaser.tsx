import type { MediaAsset, Project } from '@prisma/client';
import { FolderOpen } from 'lucide-react';
import { Section, SectionHeader } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Reveal } from '@/components/ui/reveal';
import { ProjectCard } from '@/components/cards/project-card';
import { SECTION_COPY } from '@/content/static-copy';

type ProjectWithCover = Project & { coverImage: MediaAsset | null };

/** "Études de Cas" teaser — original `.section#cases` header copy, DB-driven cards. */
export function ProjectsTeaser({ projects }: { projects: ProjectWithCover[] }) {
  const copy = SECTION_COPY.projects;
  return (
    <Section id="projects">
      <SectionHeader
        eyebrow={copy.eyebrow}
        titleLead={copy.titleLead}
        titleEm={copy.titleEm}
        sub={copy.sub}
      />

      {projects.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-8 w-8" strokeWidth={1.25} />}
          message="Études de cas bientôt disponibles — les projets récents sont en cours de documentation."
        />
      ) : (
        <>
          <div className="flex flex-col gap-8">
            {projects.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <ProjectCard project={p} index={i} />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button href="/projects" variant="outline">
              Voir tous les projets
            </Button>
          </div>
        </>
      )}
    </Section>
  );
}
