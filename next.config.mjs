/**
 * Next.js config.
 *
 * Security headers (Section 8.1) are applied globally here. The Content-Security-Policy
 * is intentionally permissive enough for Next.js inline runtime + our external hosts
 * (R2 public bucket, Pexels image CDN, Cloudflare Turnstile) but nothing else.
 *
 * TODO(decision): when the real R2_PUBLIC_URL / analytics host are known, tighten the
 * CSP `img-src` / `connect-src` / `script-src` to those exact origins.
 */

const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL ?? '';
const r2Host = safeHost(R2_PUBLIC_URL);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      // Pexels placeholder images (Section 7)
      { protocol: 'https', hostname: 'images.pexels.com' },
      // Cloudflare R2 public bucket (client uploads)
      ...(r2Host ? [{ protocol: 'https', hostname: r2Host }] : []),
    ],
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      // Next.js requires 'unsafe-inline' for its inline bootstrap; 'unsafe-eval' only in dev.
      `script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''} https://challenges.cloudflare.com`,
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: blob: https://images.pexels.com ${r2Host ? `https://${r2Host}` : ''}`,
      "font-src 'self' data:",
      "frame-src https://challenges.cloudflare.com",
      "connect-src 'self' https://api.pexels.com https://challenges.cloudflare.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      'upgrade-insecure-requests',
    ]
      .filter(Boolean)
      .join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

function safeHost(url) {
  try {
    return url ? new URL(url).host : '';
  } catch {
    return '';
  }
}

export default nextConfig;
