import Script from 'next/script';
import { env } from '@/lib/env';

/**
 * Privacy-light analytics loader (Phase 8, optional at launch). Assumes a
 * Plausible-style script keyed by a domain in NEXT_PUBLIC_ANALYTICS_ID. Renders
 * nothing when unset. Swap the src if the client chooses a different provider.
 *
 * Plausible is the supported provider; its script and connection origin are
 * included in the site CSP when this optional integration is enabled.
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
