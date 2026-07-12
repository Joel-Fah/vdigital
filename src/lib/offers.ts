/**
 * Offer duration + price formatting. Plain module (no server-only) so both the
 * admin form (select options) and server-rendered cards/drawer share it.
 */

export const DURATION_UNITS = [
  { value: 'hour', label: 'heure', plural: 'heures' },
  { value: 'day', label: 'jour', plural: 'jours' },
  { value: 'week', label: 'semaine', plural: 'semaines' },
  { value: 'month', label: 'mois', plural: 'mois' },
] as const;

export const CURRENCIES = [
  { value: 'EUR', symbol: '€' },
  { value: 'USD', symbol: '$' },
  { value: 'FCFA', symbol: 'FCFA' },
] as const;

export type DurationUnit = (typeof DURATION_UNITS)[number]['value'];
export type Currency = (typeof CURRENCIES)[number]['value'];

/** "7 jours", "1 mois" — null when incomplete. */
export function formatDuration(
  value: number | null | undefined,
  unit: string | null | undefined,
): string | null {
  if (value == null || !unit) return null;
  const u = DURATION_UNITS.find((d) => d.value === unit);
  if (!u) return `${value}`;
  return `${value} ${value > 1 ? u.plural : u.label}`;
}

/** "500 €", "300 000 FCFA" — null when incomplete. */
export function formatPrice(
  amount: number | null | undefined,
  currency: string | null | undefined,
): string | null {
  if (amount == null || !currency) return null;
  const c = CURRENCIES.find((x) => x.value === currency);
  const formatted = new Intl.NumberFormat('fr-FR').format(amount);
  return `${formatted} ${c?.symbol ?? currency}`;
}
