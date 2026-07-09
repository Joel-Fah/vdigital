import Script from 'next/script';
import { env } from '@/lib/env';

/**
 * Privacy-light analytics loader (Phase 8, optional at launch). Assumes a
 * Plausible-style script keyed by a domain in NEXT_PUBLIC_ANALYTICS_ID. Renders
 * nothing when unset. Swap the src if the client chooses a different provider.
 *
 * TODO(decision): confirm the analytics provider with the client; the CSP in
 * next.config.mjs must be widened to the provider's script/connect host.
 */
export function Analytics() {
  if (!env.analyticsId) return null;
  return (
    <Script
      defer
      data-domain={env.analyticsId}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
