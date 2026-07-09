'use client';

import { motion } from 'motion/react';

/**
 * SkillBar — animated width fill on scroll into view (original `.skill-bar`).
 * Respects prefers-reduced-motion via Motion's built-in handling + globals.css.
 */
export function SkillBar({ name, level }: { name: string; level: number }) {
  const pct = Math.max(0, Math.min(100, level));
  return (
    <div>
      <div className="mb-1.5 flex justify-between">
        <span className="text-[0.85rem] text-ink">{name}</span>
        <span className="text-[0.72rem] text-ink-muted">{pct}%</span>
      </div>
      <div className="h-[3px] rounded-sm bg-teal-light">
        <motion.div
          className="h-full rounded-sm"
          style={{ background: 'linear-gradient(90deg, var(--teal-dark), var(--teal-bright))' }}
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
