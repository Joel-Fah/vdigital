import 'server-only';
import nodemailer from 'nodemailer';
import { env } from '@/lib/env';

/**
 * Contact-form email notifications (Section 10 / 12.6 — Zoho SMTP or similar).
 * No-ops gracefully when SMTP isn't configured so the message is still stored in
 * the inbox and the form succeeds.
 */
export async function sendContactNotification(msg: {
  name: string;
  email: string;
  subject?: string | null;
  message: string;
}): Promise<void> {
  if (!env.smtp.isConfigured) {
    console.warn('[email] SMTP not configured — skipping notification (message stored in inbox).');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: { user: env.smtp.user, pass: env.smtp.password },
  });

  await transporter.sendMail({
    from: `"VDIGITAL — Formulaire" <${env.smtp.user}>`,
    to: env.smtp.notifyTo,
    replyTo: msg.email,
    subject: `Nouveau message${msg.subject ? ` — ${msg.subject}` : ''} (${msg.name})`,
    text: `De: ${msg.name} <${msg.email}>\n\n${msg.message}`,
    html: `<p><strong>De:</strong> ${escapeHtml(msg.name)} &lt;${escapeHtml(msg.email)}&gt;</p>${
      msg.subject ? `<p><strong>Sujet:</strong> ${escapeHtml(msg.subject)}</p>` : ''
    }<hr/><p style="white-space:pre-wrap">${escapeHtml(msg.message)}</p>`,
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
