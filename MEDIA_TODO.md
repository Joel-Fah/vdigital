# MEDIA_TODO — placeholder image tracker

This file tracks every image slot that ships **without a real client photo** and
therefore uses a placeholder (Pexels-sourced or a CSS/monogram stand-in). It is a
living deliverable: **do not delete it once real images are added** — instead tick
items off as they're replaced.

How to replace an image: open the dashboard → **Médias**, upload the real photo (or
attach a Pexels one), then open the relevant record (Projets / Services / Clients /
Offres / Témoignages) and pick the new image in its media field. Section-level
visuals (hero/about) are noted below as code TODOs.

> Grep the codebase for `PEXELS-PLACEHOLDER` to find every inline marker.

## Status legend

- [ ] = still a placeholder
- [x] = real client image in place

---

## Section-level visuals

| #   | Where                      | Standing in for              | Current state                                                                                                            | How to replace                                              |
| --- | -------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| [x] | Nav / Hero / Footer — logo | VDIGITAL logo                | **Real asset.** Extracted from the original HTML's base64 to `public/vdigital-logo.jpg`.                                 | Nothing to do — this is the client's own logo.              |
| [x] | About — award medal        | Canal+ Creative Talent medal | **Real asset.** Extracted to `public/award-medal.jpg`.                                                                   | Nothing to do.                                              |
| [ ] | About — avatar             | Portrait of Vitus            | "VU" gradient monogram in `src/components/sections/about.tsx` — same as the original HTML, which also had no photo here. | Supply a headshot, then swap the monogram for an `<Image>`. |

> Note: the original HTML contained **no photographic imagery at all** — only the logo and
> the award medal, both now extracted as real files. So there are currently **zero Pexels
> placeholders in the codebase**. Pexels remains wired up in the dashboard for when the
> client adds project covers, client logos and testimonial photos (below).

## List-content images (managed entirely from the dashboard)

These have **no placeholder by default** — the record simply renders without an
image until one is attached. Track them here as real content is created:

| [ ] | Project cover images | per project | none until set | Médias → attach in each project's "Image de couverture" |
| [ ] | Project galleries | per project | none until set | (gallery attach — see roadmap in README) |
| [ ] | Service icons | per service (optional) | lucide fallback icon | Médias → attach in each service's "Icône" |
| [ ] | Client logos | per client | teal dot fallback | Médias → attach in each client's "Logo" |
| [ ] | Offer images | per offer (optional) | emoji icon + none until set | Médias → attach in each offer's "Image" |
| [ ] | Testimonial photos | per testimonial (optional) | initial-letter avatar | Médias → attach in each testimonial's "Photo" |

## Notes

- Pexels images are stored with `source: "pexels"`, a `pexelsId`, and the
  photographer credit (`pexelsCredit`), shown as "© Photographer" in the library
  and flagged with a **Pexels** badge so they're easy to spot and swap.
- No video anywhere in this phase (Section 7.5) — a static image is the correct
  substitute for any spot the original design implied motion.
