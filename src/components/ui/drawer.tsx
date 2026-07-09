'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';

/**
 * Drawer — right-anchored, full-height panel used instead of detail pages
 * (Section 5.3). Built on Radix Dialog so focus-trap, Escape handling, and
 * focus-return-to-trigger come for free; we skin it with Tailwind and animate
 * with Motion. Controlled `open` so the parent can bind it to a URL query param.
 *
 * ~460px on desktop, full-width on mobile. Closes on overlay click, Escape,
 * or the close button; the URL-sync wrapper adds browser-back closing.
 */
export function Drawer({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[200] bg-ink/30 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                className="fixed right-0 top-0 z-[201] flex h-full w-full flex-col bg-surface-white shadow-card outline-none sm:w-[480px]"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              >
                <div className="flex items-center justify-between border-b border-line px-6 py-4">
                  <Dialog.Title className="font-display text-[1.05rem] font-bold text-ink">
                    {title}
                  </Dialog.Title>
                  <Dialog.Close
                    className="rounded p-1.5 text-ink-muted transition-colors hover:bg-teal-ultra hover:text-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                    aria-label="Fermer"
                  >
                    <X className="h-5 w-5" />
                  </Dialog.Close>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
