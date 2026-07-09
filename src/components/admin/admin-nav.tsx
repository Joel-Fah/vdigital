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
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ICONS = {
  dashboard: LayoutDashboard,
  projects: FolderKanban,
  services: Wrench,
  clients: Building2,
  expertise: BarChart3,
  offers: Package,
  testimonials: MessageSquareQuote,
  messages: Inbox,
  media: ImageIcon,
  sections: LayoutList,
  settings: Settings,
} as const;

/** Admin sidebar navigation. `base` is the resolved admin base path. */
export function AdminNav({ base }: { base: string }) {
  const pathname = usePathname();
  const items: { key: keyof typeof ICONS; label: string; sub: string }[] = [
    { key: 'dashboard', label: 'Tableau de bord', sub: 'dashboard' },
    { key: 'projects', label: 'Projets', sub: 'projects' },
    { key: 'services', label: 'Services', sub: 'services' },
    { key: 'clients', label: 'Clients', sub: 'clients' },
    { key: 'expertise', label: 'Expertise', sub: 'expertise' },
    { key: 'offers', label: 'Offres', sub: 'offers' },
    { key: 'testimonials', label: 'Témoignages', sub: 'testimonials' },
    { key: 'messages', label: 'Messages', sub: 'messages' },
    { key: 'media', label: 'Médias', sub: 'media' },
    { key: 'sections', label: 'Sections', sub: 'sections' },
    { key: 'settings', label: 'Réglages', sub: 'settings' },
  ];

  return (
    <nav className="flex flex-col gap-0.5">
      {items.map((item) => {
        const href = `${base}/${item.sub}`;
        const active = pathname === href || pathname.startsWith(`${href}/`);
        const Icon = ICONS[item.key];
        return (
          <Link
            key={item.key}
            href={href}
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
    </nav>
  );
}
