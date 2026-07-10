'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  Building2,
  BarChart3,
  Package,
  MessageSquareQuote,
  Inbox,
  ImageIcon,
  Settings,
  LayoutList,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Item = { icon: LucideIcon; label: string; sub: string };
type Group = { heading?: string; items: Item[] };

/**
 * Admin sidebar navigation, organised into groups (Overview / Content /
 * Inbox & Media / Configuration) so the growing list stays scannable.
 * `base` is the resolved admin base path. `onNavigate` lets the mobile drawer
 * close on selection.
 */
const GROUPS: Group[] = [
  { items: [{ icon: LayoutDashboard, label: 'Tableau de bord', sub: 'dashboard' }] },
  {
    heading: 'Contenu',
    items: [
      { icon: FolderKanban, label: 'Projets', sub: 'projects' },
      { icon: Wrench, label: 'Services', sub: 'services' },
      { icon: Building2, label: 'Clients', sub: 'clients' },
      { icon: BarChart3, label: 'Expertise', sub: 'expertise' },
      { icon: Package, label: 'Offres', sub: 'offers' },
      { icon: MessageSquareQuote, label: 'Témoignages', sub: 'testimonials' },
    ],
  },
  {
    heading: 'Boîte & médias',
    items: [
      { icon: Inbox, label: 'Messages', sub: 'messages' },
      { icon: ImageIcon, label: 'Médias', sub: 'media' },
    ],
  },
  {
    heading: 'Configuration',
    items: [
      { icon: LayoutList, label: 'Sections', sub: 'sections' },
      { icon: Settings, label: 'Réglages', sub: 'settings' },
    ],
  },
];

export function AdminNav({ base, onNavigate }: { base: string; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-4">
      {GROUPS.map((group, gi) => (
        <div key={gi} className="flex flex-col gap-0.5">
          {group.heading && (
            <p className="mb-1 px-3 text-[0.6rem] font-medium uppercase tracking-[1.5px] text-ink-light">
              {group.heading}
            </p>
          )}
          {group.items.map((item) => {
            const href = `${base}/${item.sub}`;
            const active = pathname === href || pathname.startsWith(`${href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.sub}
                href={href}
                onClick={onNavigate}
                className={cn(
                  'flex items-center gap-3 rounded px-3 py-2 text-[0.83rem] transition-colors',
                  active
                    ? 'bg-teal-ultra font-medium text-teal'
                    : 'text-ink-mid hover:bg-surface-off hover:text-teal',
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
