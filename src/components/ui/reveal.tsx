'use client';

import { motion, type HTMLMotionProps } from 'motion/react';

/**
 * Reveal — section/element entrance animation (Section 2.3 / Phase 3).
 * Fades and rises on scroll into view, once. Motion honours
 * prefers-reduced-motion automatically.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
  ...rest
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: keyof typeof motion;
} & HTMLMotionProps<'div'>) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
