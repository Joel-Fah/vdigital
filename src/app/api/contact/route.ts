import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validation/contact';
import { prisma } from '@/lib/prisma';
import { verifyTurnstile } from '@/lib/turnstile';
import { clientIp, hashIdentifier, isContactBlocked, recordContactAttempt } from '@/lib/ratelimit';
import { sendContactNotification } from '@/lib/email';

export const runtime = 'nodejs';

/**
 * Public contact endpoint (Section 8.4). Layers: honeypot → Zod → Turnstile →
 * per-IP rate limit → store → best-effort email. Generic errors; never leaks
 * which layer rejected beyond what the user needs.
 */
export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Merci de vérifier les champs du formulaire.' },
      { status: 400 },
    );
  }
  const { name, email, subject, message, turnstileToken, company } = parsed.data;

  // Honeypot: bots fill hidden fields. Pretend success, store nothing.
  if (company) return NextResponse.json({ ok: true });

  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return NextResponse.json({ error: 'Vérification anti-robot échouée.' }, { status: 400 });
  }

  if (await isContactBlocked(ip)) {
    return NextResponse.json(
      { error: 'Trop de messages envoyés. Réessayez plus tard.' },
      { status: 429 },
    );
  }

  try {
    await prisma.contactMessage.create({
      data: { name, email, subject: subject || null, message, ipHash: hashIdentifier(ip) },
    });
    await recordContactAttempt(ip);
    // Email is best-effort — a delivery failure must not fail the submission.
    await sendContactNotification({ name, email, subject, message }).catch((e) =>
      console.error('[contact] email failed:', e),
    );
  } catch (err) {
    console.error('[contact] store failed:', err);
    return NextResponse.json({ error: 'Une erreur est survenue. Réessayez.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
