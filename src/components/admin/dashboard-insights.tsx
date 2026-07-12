import Link from 'next/link';
import { AlertTriangle, Lightbulb, Info, ArrowRight } from 'lucide-react';
import { adminPath } from '@/lib/admin';
import type { Insight, InsightLevel } from '@/lib/dashboard-insights';

const STYLES: Record<
  InsightLevel,
  { border: string; badge: string; label: string; icon: React.ReactNode }
> = {
  high: {
    border: 'border-l-red-400',
    badge: 'bg-red-50 text-red-600',
    label: 'Priorité',
    icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
  },
  medium: {
    border: 'border-l-gold',
    badge: 'bg-gold/10 text-gold',
    label: 'À faire',
    icon: <Lightbulb className="h-4 w-4 text-gold" />,
  },
  low: {
    border: 'border-l-teal',
    badge: 'bg-teal-ultra text-teal',
    label: 'Astuce',
    icon: <Info className="h-4 w-4 text-teal" />,
  },
};

/** Prioritised activity insights, rendered as a bento of accent-bordered cards. */
export function DashboardInsights({ insights }: { insights: Insight[] }) {
  if (insights.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-[0.8rem] font-medium uppercase tracking-wide text-ink-muted">
        À votre attention
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {insights.map((ins) => {
          const s = STYLES[ins.level];
          const body = (
            <>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-[0.9rem] font-medium text-ink">
                  {s.icon}
                  {ins.title}
                </span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[0.58rem] font-medium uppercase tracking-wide ${s.badge}`}
                >
                  {s.label}
                </span>
              </div>
              <p className="text-[0.8rem] leading-relaxed text-ink-muted">{ins.body}</p>
              {ins.sub && (
                <span className="mt-2 inline-flex items-center gap-1 text-[0.75rem] font-medium text-teal">
                  Ouvrir <ArrowRight className="h-3 w-3" />
                </span>
              )}
            </>
          );
          const className = `block rounded-lg border border-l-4 border-line bg-surface-white p-4 ${s.border} ${
            ins.sub ? 'transition-colors hover:border-teal/40' : ''
          }`;
          return ins.sub ? (
            <Link key={ins.id} href={adminPath(ins.sub)} className={className}>
              {body}
            </Link>
          ) : (
            <div key={ins.id} className={className}>
              {body}
            </div>
          );
        })}
      </div>
    </section>
  );
}
