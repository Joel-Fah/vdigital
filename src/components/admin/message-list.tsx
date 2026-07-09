'use client';

import { useState, useTransition } from 'react';
import { Mail, MailOpen, Trash2, ChevronDown } from 'lucide-react';
import type { ContactMessage } from '@prisma/client';
import { formatDate } from '@/lib/utils';
import { EmptyState } from '@/components/ui/empty-state';
import {
  setMessageReadAction,
  deleteMessageAction,
} from '@/app/[adminBasePath]/(dashboard)/messages/actions';

/** Contact inbox (Section 6 admin empty state). Expand to read; mark read/unread; delete. */
export function MessageList({ messages }: { messages: ContactMessage[] }) {
  const [pending, start] = useTransition();
  const [openId, setOpenId] = useState<string | null>(null);

  if (messages.length === 0) {
    return (
      <EmptyState
        variant="admin"
        icon={<Mail className="h-8 w-8" strokeWidth={1.25} />}
        message="No messages yet. When someone submits the contact form, it'll show up here."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface-white">
      <ul className="divide-y divide-line">
        {messages.map((m) => {
          const open = openId === m.id;
          return (
            <li key={m.id} className={m.read ? '' : 'bg-teal-ultra/40'}>
              <div className="flex items-center gap-3 px-4 py-3">
                <button
                  onClick={() => {
                    setOpenId(open ? null : m.id);
                    if (!m.read) start(() => setMessageReadAction(m.id, true).then(() => {}));
                  }}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  {m.read ? (
                    <MailOpen className="h-4 w-4 flex-shrink-0 text-ink-light" />
                  ) : (
                    <Mail className="h-4 w-4 flex-shrink-0 text-teal" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-[0.88rem] ${m.read ? 'text-ink' : 'font-medium text-ink'}`}
                    >
                      {m.name}{' '}
                      {m.subject ? <span className="text-ink-muted">— {m.subject}</span> : null}
                    </p>
                    <p className="truncate text-[0.72rem] text-ink-muted">{m.email}</p>
                  </div>
                  <span className="hidden flex-shrink-0 text-[0.72rem] text-ink-muted sm:block">
                    {formatDate(m.createdAt)}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 flex-shrink-0 text-ink-light transition-transform ${open ? 'rotate-180' : ''}`}
                  />
                </button>
                <button
                  aria-label="Supprimer"
                  disabled={pending}
                  onClick={() => {
                    if (confirm('Supprimer ce message ?'))
                      start(() => deleteMessageAction(m.id).then(() => {}));
                  }}
                  className="text-ink-muted hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {open && (
                <div className="border-t border-line-soft px-4 py-4">
                  <p className="whitespace-pre-line text-[0.85rem] leading-relaxed text-ink-mid">
                    {m.message}
                  </p>
                  <div className="mt-3 flex items-center gap-4">
                    <a
                      href={`mailto:${m.email}`}
                      className="text-[0.78rem] text-teal hover:underline"
                    >
                      Répondre par email
                    </a>
                    <button
                      onClick={() =>
                        start(() => setMessageReadAction(m.id, !m.read).then(() => {}))
                      }
                      className="text-[0.78rem] text-ink-muted hover:text-teal"
                    >
                      Marquer comme {m.read ? 'non lu' : 'lu'}
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
