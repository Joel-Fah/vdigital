import 'server-only';
import sanitizeHtmlLib from 'sanitize-html';

/**
 * Sanitize rich-text HTML from the Tiptap editor before it is stored (sanitize
 * on write). Only text-formatting tags are allowed — no layout, no scripts, no
 * styles — so the stored HTML is always safe to render with dangerouslySet-
 * InnerHTML on both server and client.
 */
export function sanitizeRichText(dirty: string): string {
  const clean = sanitizeHtmlLib(dirty, {
    allowedTags: [
      'p',
      'br',
      'strong',
      'b',
      'em',
      'i',
      'u',
      's',
      'ul',
      'ol',
      'li',
      'a',
      'blockquote',
    ],
    allowedAttributes: { a: ['href', 'target', 'rel'] },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      // Force safe link attributes.
      a: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, target: '_blank', rel: 'noopener noreferrer nofollow' },
      }),
    },
  }).trim();
  // An "empty" editor yields <p></p>; normalise that to a true empty string.
  return clean === '<p></p>' ? '' : clean;
}
