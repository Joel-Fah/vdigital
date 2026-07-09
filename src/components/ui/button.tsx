import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * Button — replicates `.btn-primary`, `.btn-outline`, `.nav-cta` (Section 2.4).
 * Same uppercase / letter-spacing / 2px-radius treatment as the original.
 * Renders as <a> (via next/link) when `href` is provided, otherwise <button>.
 */

type Variant = 'primary' | 'outline' | 'cta';
type Size = 'sm' | 'md';

const base =
  'inline-flex items-center justify-center gap-2 rounded font-sans uppercase tracking-wide ' +
  'transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2';

const variants: Record<Variant, string> = {
  primary: 'bg-teal text-white hover:bg-teal-dark hover:-translate-y-px',
  outline: 'border-[1.5px] border-teal bg-transparent text-teal hover:bg-teal-ultra',
  cta: 'bg-teal text-white hover:bg-teal-dark',
};

const sizes: Record<Size, string> = {
  sm: 'px-[22px] py-[9px] text-[0.75rem]',
  md: 'px-7 py-[13px] text-[0.8rem]',
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<React.ComponentPropsWithoutRef<typeof Link>, keyof CommonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', className, children, ...rest } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ('href' in props && props.href !== undefined) {
    const { href, ...linkRest } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonAsButton)}>
      {children}
    </button>
  );
}
