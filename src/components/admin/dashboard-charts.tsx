'use client';

import { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import type { DashboardStats } from '@/lib/dashboard-stats';

ChartJS.register(
  ArcElement,
  LineElement,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend,
);

// Validated categorical palette (dataviz skill reference, light surface).
// Passes lightness / chroma / CVD; WARN slots rely on legend + table for relief.
const SERIES = ['#2a78d6', '#1baf7a', '#eda100', '#008300', '#4a3aa7', '#e34948'];
const GRID = 'rgba(27,122,122,0.09)';
const INK_MUTED = '#7A9898';

// Canvas can't read CSS vars — use a literal stack close to the UI font.
ChartJS.defaults.font.family = "system-ui, -apple-system, 'Segoe UI', sans-serif";
ChartJS.defaults.color = INK_MUTED;

export function DashboardCharts({ stats }: { stats: DashboardStats }) {
  const contentTotal = stats.contentBreakdown.reduce((a, c) => a + c.value, 0);
  const msgTotal = stats.messagesByDay.reduce((a, d) => a + d.count, 0);
  const mediaTotal = stats.mediaBySource.upload + stats.mediaBySource.pexels;

  const doughnut = useMemo(
    () => ({
      labels: stats.contentBreakdown.map((c) => c.label),
      datasets: [
        {
          data: stats.contentBreakdown.map((c) => c.value),
          backgroundColor: SERIES,
          borderColor: '#ffffff',
          borderWidth: 2, // 2px surface gap between segments (mark spec)
          hoverOffset: 4,
        },
      ],
    }),
    [stats.contentBreakdown],
  );

  const line = useMemo(
    () => ({
      labels: stats.messagesByDay.map((d) => d.date),
      datasets: [
        {
          label: 'Messages',
          data: stats.messagesByDay.map((d) => d.count),
          borderColor: SERIES[0],
          backgroundColor: 'rgba(42,120,214,0.10)',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.3,
          fill: true,
        },
      ],
    }),
    [stats.messagesByDay],
  );

  const bar = useMemo(
    () => ({
      labels: ['Téléversées', 'Pexels'],
      datasets: [
        {
          label: 'Médias',
          data: [stats.mediaBySource.upload, stats.mediaBySource.pexels],
          backgroundColor: [SERIES[1], SERIES[2]],
          borderRadius: 4, // rounded data-ends (mark spec)
          borderSkipped: false,
          maxBarThickness: 64,
        },
      ],
    }),
    [stats.mediaBySource],
  );

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Content breakdown — spans 1, doughnut with legend (identity via text) */}
      <Card title="Répartition du contenu" className="lg:col-span-1">
        {contentTotal === 0 ? (
          <NoData />
        ) : (
          <div className="h-64">
            <Doughnut data={doughnut} options={doughnutOpts} />
          </div>
        )}
      </Card>

      {/* Messages over time — spans 2, single-series line */}
      <Card title={`Messages (30 derniers jours)`} className="lg:col-span-2">
        {msgTotal === 0 ? (
          <NoData label="Aucun message sur la période." />
        ) : (
          <div className="h-64">
            <Line data={line} options={lineOpts} />
          </div>
        )}
      </Card>

      {/* Media by source — bar */}
      <Card title="Médias par source" className="lg:col-span-1">
        {mediaTotal === 0 ? (
          <NoData label="Aucun média." />
        ) : (
          <div className="h-56">
            <Bar data={bar} options={barOpts} />
          </div>
        )}
      </Card>

      {/* Recent messages — the table view (also satisfies the palette relief rule) */}
      <Card title="Messages récents" className="lg:col-span-2">
        {stats.recentMessages.length === 0 ? (
          <NoData label="Aucun message pour l'instant." />
        ) : (
          <ul className="divide-y divide-line text-[0.82rem]">
            {stats.recentMessages.map((m) => (
              <li key={m.id} className="flex items-center gap-3 py-2">
                <span
                  className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${m.read ? 'bg-ink-light' : 'bg-teal'}`}
                  aria-hidden
                />
                <span
                  className={`min-w-0 flex-1 truncate ${m.read ? 'text-ink-mid' : 'font-medium text-ink'}`}
                >
                  {m.name}
                  {m.subject ? <span className="text-ink-muted"> — {m.subject}</span> : null}
                </span>
                <time className="flex-shrink-0 text-[0.72rem] text-ink-muted">
                  {new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short' }).format(
                    m.createdAt,
                  )}
                </time>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Card({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-lg border border-line bg-surface-white p-5 ${className ?? ''}`}>
      <h3 className="mb-4 text-[0.8rem] font-medium uppercase tracking-wide text-ink-mid">
        {title}
      </h3>
      {children}
    </div>
  );
}

function NoData({ label = 'Pas encore de données.' }: { label?: string }) {
  return (
    <div className="flex h-56 items-center justify-center rounded-md bg-surface-off text-center text-[0.82rem] text-ink-muted">
      {label}
    </div>
  );
}

const doughnutOpts: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '62%',
  plugins: {
    legend: { position: 'right', labels: { usePointStyle: true, boxWidth: 8, padding: 12 } },
    tooltip: { boxPadding: 4 },
  },
};

const lineOpts: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: { legend: { display: false }, tooltip: { boxPadding: 4 } },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        maxTicksLimit: 6,
        callback(value) {
          const raw = this.getLabelForValue(value as number);
          return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short' }).format(
            new Date(raw),
          );
        },
      },
    },
    y: {
      beginAtZero: true,
      ticks: { precision: 0, maxTicksLimit: 5 },
      grid: { color: GRID },
      border: { display: false },
    },
  },
};

const barOpts: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { boxPadding: 4 } },
  scales: {
    x: { grid: { display: false } },
    y: {
      beginAtZero: true,
      ticks: { precision: 0, maxTicksLimit: 5 },
      grid: { color: GRID },
      border: { display: false },
    },
  },
};
