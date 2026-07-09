import type { Config } from 'tailwindcss';

/**
 * Design tokens extracted verbatim from portfolio_vdigital_FINAL.html (:root block).
 * This is a rebuild, not a redesign — do not invent new tokens (Section 2).
 *
 * TODO(decision): Tailwind v3.4 chosen over v4 to match the config-file token format
 * given in the build spec (Section 2.1) and avoid the v4 CSS-first migration risk.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#1B7A7A',
          dark: '#0D4F4F',
          mid: '#2A9D9D',
          bright: '#3BBFBF',
          light: '#E8F6F6',
          ultra: '#F0FAFA',
        },
        gold: {
          DEFAULT: '#C9A84C',
          soft: '#E6C86E',
        },
        ink: {
          DEFAULT: '#1A2B2B', // --text
          mid: '#3D5555', // --text-mid
          muted: '#7A9898', // --text-muted
          light: '#A8BFBF', // --text-light
        },
        surface: {
          white: '#FFFFFF',
          off: '#FAFCFC',
        },
        // Named `line` (not `border`) so it doesn't collide with Tailwind's border-* utilities.
        line: {
          DEFAULT: 'rgba(27,122,122,0.12)',
          soft: 'rgba(27,122,122,0.07)',
        },
      },
      fontFamily: {
        // Wired to next/font CSS variables in src/lib/fonts.ts
        display: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        sans: ['var(--font-dm-sans)', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        // Intentionally small and sharp (Section 2.3): 2–4px everywhere.
        DEFAULT: '2px',
        sm: '1px',
        md: '3px',
        lg: '4px',
      },
      boxShadow: {
        card: '0 8px 40px rgba(27,122,122,0.12)',
        'card-hover': '0 8px 40px rgba(27,122,122,0.08)',
        float: '0 4px 16px rgba(27,122,122,0.1)',
        soft: '0 4px 20px rgba(27,122,122,0.07)',
      },
      letterSpacing: {
        eyebrow: '3px',
        label: '2px',
        wide: '1.2px',
      },
      fontSize: {
        // Preserve the original scale (Section 2.2)
        'hero-name': ['clamp(2.2rem, 3.5vw, 3.5rem)', { lineHeight: '1.1' }],
        'sec-title': ['clamp(1.6rem, 2.2vw, 2rem)', { lineHeight: '1.2' }],
        eyebrow: ['0.7rem', { letterSpacing: '3px' }],
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease forwards',
      },
    },
  },
  plugins: [],
};

export default config;
