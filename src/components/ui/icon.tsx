import {
  Trophy,
  BarChart3,
  Sparkles,
  Globe,
  MapPin,
  Search,
  GraduationCap,
  Building2,
  Palette,
  UserRound,
  Rocket,
  Users,
  type LucideProps,
} from 'lucide-react';

/**
 * Named-icon resolver. Lets serializable data (static-copy, DB rows) reference a
 * lucide icon by a short key instead of embedding an emoji — so the site uses
 * consistent line icons everywhere, never emoji.
 */
const ICONS = {
  trophy: Trophy,
  'bar-chart': BarChart3,
  sparkle: Sparkles,
  globe: Globe,
  pin: MapPin,
  search: Search,
  graduation: GraduationCap,
  building: Building2,
  palette: Palette,
  user: UserRound,
  rocket: Rocket,
  users: Users,
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Cmp = ICONS[name];
  return <Cmp {...props} />;
}
