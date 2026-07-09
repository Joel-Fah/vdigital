import type { SiteSettings } from '@prisma/client';
import { Section } from '@/components/ui/section';
import { ContactForm } from './contact-form';
import { CONTACT, CONTACT_DIRECT } from '@/content/static-copy';

/**
 * Contact — `.contact-box` rebuilt verbatim (eyebrow, serif title with the
 * italic teal line, sub-copy, and the two direct `.contact-link` buttons).
 *
 * The original had links only; spec §2.4 defines ContactPanel as "form + direct
 * contact links", so the form sits below the links, separated by a hairline.
 * Direct links prefer SiteSettings when set, falling back to the original values.
 */
export function ContactSection({
  settings,
  turnstileSiteKey,
}: {
  settings: SiteSettings | null;
  turnstileSiteKey?: string;
}) {
  const email = settings?.contactEmail || CONTACT_DIRECT.email;
  const social = (settings?.socialLinks as Record<string, string> | null) ?? {};
  const linkedin = social.linkedin || CONTACT_DIRECT.linkedin;

  return (
    <Section id="contact">
      <div className="rounded-lg border border-line bg-teal-ultra px-6 py-16 text-center md:px-16">
        <p className="mb-[0.8rem] text-[0.68rem] uppercase tracking-eyebrow text-teal">
          {CONTACT.eyebrow}
        </p>
        <h2 className="mb-4 font-display text-[2rem] leading-[1.2] text-ink">
          {CONTACT.titleLead}
          <br />
          <em className="italic text-teal">{CONTACT.titleEm}</em>
        </h2>
        <p className="mx-auto mb-10 max-w-[500px] text-[0.88rem] leading-[1.7] text-ink-muted">
          {CONTACT.sub}
        </p>

        {/* .contact-links */}
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={`mailto:${email}`}
            className="inline-block rounded border-[1.5px] border-teal bg-teal px-6 py-[11px] text-[0.75rem] uppercase tracking-[1px] text-white transition-all duration-200 hover:bg-teal-dark"
          >
            {email}
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded border-[1.5px] border-teal px-6 py-[11px] text-[0.75rem] uppercase tracking-[1px] text-teal transition-all duration-200 hover:bg-teal hover:text-white"
          >
            LinkedIn
          </a>
        </div>

        {/* Form (spec §2.4 ContactPanel) */}
        <div className="mx-auto mt-12 max-w-xl border-t border-line pt-10">
          <p className="mb-6 text-[0.7rem] uppercase tracking-[2px] text-ink-muted">
            — Ou écrivez-moi directement
          </p>
          <ContactForm turnstileSiteKey={turnstileSiteKey} />
        </div>
      </div>
    </Section>
  );
}
