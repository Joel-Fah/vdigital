'use client';

import { useEffect, useRef } from 'react';

/**
 * Cloudflare Turnstile widget (Section 8.3) — invisible/managed challenge on the
 * login and contact forms. Renders nothing (and calls onVerify with '') when no
 * site key is configured, so local dev without keys still works.
 *
 * Loads the Turnstile script once; the CSP in next.config.mjs already allows
 * challenges.cloudflare.com for script-src/frame-src.
 */
declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

export function Turnstile({
  siteKey,
  onVerify,
}: {
  siteKey?: string;
  onVerify: (token: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey) {
      onVerify(''); // no-op token in unconfigured environments
      return;
    }

    function render() {
      if (!ref.current || !window.turnstile) return;
      widgetId.current = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: (token: string) => onVerify(token),
        'error-callback': () => onVerify(''),
        'expired-callback': () => onVerify(''),
        theme: 'light',
      });
    }

    if (window.turnstile) {
      render();
    } else if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = render;
      document.head.appendChild(script);
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          render();
        }
      }, 200);
      return () => clearInterval(interval);
    }

    return () => {
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);

  if (!siteKey) return null;
  return <div ref={ref} className="my-2" />;
}
