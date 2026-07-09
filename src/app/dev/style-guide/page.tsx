import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/eyebrow';
import { StatBlock } from '@/components/ui/stat-block';
import { SkillBar } from '@/components/ui/skill-bar';
import { TagPill } from '@/components/ui/tag-pill';
import { EmptyState } from '@/components/ui/empty-state';

/**
 * Internal style guide (Phase 1) — visually confirms fidelity to the original
 * before building real pages. Excluded from production (404s) and never linked
 * in the public nav.
 */
export const metadata = { robots: { index: false, follow: false } };

const SWATCHES = [
  ['teal', '#1B7A7A'],
  ['teal-dark', '#0D4F4F'],
  ['teal-mid', '#2A9D9D'],
  ['teal-bright', '#3BBFBF'],
  ['teal-light', '#E8F6F6'],
  ['teal-ultra', '#F0FAFA'],
  ['gold', '#C9A84C'],
  ['ink', '#1A2B2B'],
  ['ink-mid', '#3D5555'],
  ['ink-muted', '#7A9898'],
];

export default function StyleGuidePage() {
  if (process.env.NODE_ENV === 'production') notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-14 px-6 py-16">
      <header>
        <Eyebrow>— Design system</Eyebrow>
        <h1 className="mt-2 font-display text-hero-name font-bold text-ink">
          VDIGITAL <em className="not-italic text-teal">Style Guide</em>
        </h1>
        <p className="mt-2 text-[0.9rem] text-ink-muted">
          Tokens extracted from the original HTML (dev-only).
        </p>
      </header>

      <Group title="Colours">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {SWATCHES.map(([name, hex]) => (
            <div key={name} className="rounded-md border border-line">
              <div className="h-16 rounded-t-md" style={{ background: hex }} />
              <div className="p-2">
                <p className="text-[0.72rem] font-medium text-ink">{name}</p>
                <p className="text-[0.65rem] text-ink-muted">{hex}</p>
              </div>
            </div>
          ))}
        </div>
      </Group>

      <Group title="Typography">
        <h2 className="font-display text-sec-title font-bold text-ink">
          Playfair Display — <em className="italic text-teal">section title</em>
        </h2>
        <p className="mt-3 max-w-prose text-[0.9rem] leading-loose text-ink-mid">
          DM Sans body copy. The quick brown fox jumps over the lazy dog. Rigueur stratégique, sens
          créatif et maîtrise des outils digitaux.
        </p>
      </Group>

      <Group title="Buttons">
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="cta" size="sm">
            CTA small
          </Button>
        </div>
      </Group>

      <Group title="Stat blocks">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatBlock value="5+" label="Années" size="lg" />
          <StatBlock value="13+" label="Clients" size="lg" />
          <StatBlock value="1,6M" label="Vues" size="lg" />
          <StatBlock value="+180%" label="Engagement" trend="↑ vs. N-1" size="lg" />
        </div>
      </Group>

      <Group title="Skill bars">
        <div className="max-w-md space-y-4">
          <SkillBar name="Community Management" level={95} />
          <SkillBar name="Social Media Strategy" level={90} />
          <SkillBar name="Branding" level={80} />
        </div>
      </Group>

      <Group title="Tags">
        <div className="flex flex-wrap gap-2">
          <TagPill>Stratégie</TagPill>
          <TagPill tone="gold">Lauréat</TagPill>
          <TagPill tone="muted">Média</TagPill>
        </div>
      </Group>

      <Group title="Empty states">
        <div className="grid gap-4 sm:grid-cols-2">
          <EmptyState message="Services are being finalised — check back shortly." />
          <EmptyState
            variant="admin"
            message="Nothing here yet — click '+ Add' to create the first one."
          />
        </div>
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-4 border-b border-line pb-2 text-[0.7rem] uppercase tracking-eyebrow text-teal">
        {title}
      </h3>
      {children}
    </section>
  );
}
