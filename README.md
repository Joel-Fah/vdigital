# VDIGITAL — Vitus Ahanda Portfolio

A dynamic, database-backed rebuild of the VDIGITAL / Vitus Ahanda portfolio, with a
full CRUD admin dashboard. Every piece of user-facing content is editable from the
dashboard — **the public site never needs a code change to update content.**

This README is the technical hand-over document: what was built, how it fits together,
and — just as importantly — **why** each decision was made.

---

## Table of contents

1. [What this is](#1-what-this-is)
2. [Stack & resolved versions](#2-stack--resolved-versions)
3. [Architecture at a glance](#3-architecture-at-a-glance)
4. [The design system](#4-the-design-system)
5. [Data model](#5-data-model)
6. [Key UX behaviours & how they work](#6-key-ux-behaviours--how-they-work)
7. [Security model](#7-security-model)
8. [Media strategy](#8-media-strategy)
9. [Local setup](#9-local-setup)
10. [Editing content (for the client)](#10-editing-content-for-the-client)
11. [Rotating the admin path & password](#11-rotating-the-admin-path--password)
12. [Deployment](#12-deployment)
13. [Design decisions & trade-offs](#13-design-decisions--trade-offs)
14. [Known gaps & roadmap](#14-known-gaps--roadmap)
15. [Project structure](#15-project-structure)

---

## 1. What this is

The starting point was a single static `portfolio_vdigital_FINAL.html` (kept in
`design/` for reference). That file defined a distinctive visual identity — deep teal +
gold, Playfair Display headings over DM Sans body, sharp 2–4px corners, translucent
teal borders, soft teal-tinted shadows. **This project is a faithful rebuild of that
identity on a modern, editable stack — not a redesign.** A returning visitor should
notice only that it feels faster and more alive.

The public site is one scrolling homepage (nine reorderable/hideable sections) plus two
full listing pages (`/projects`, `/services`) with progressive loading. Project, service
and offer details open in a **right-side drawer**, not dedicated pages. Behind an
obscured, authenticated path sits a dashboard with full CRUD over every content type,
a media library (uploads + Pexels placeholders), a contact-message inbox, site settings,
and homepage section ordering.

---

## 2. Stack & resolved versions

| Layer              | Choice                                                  | Resolved version                    |
| ------------------ | ------------------------------------------------------- | ----------------------------------- |
| Language           | TypeScript (strict)                                     | 5.9.x                               |
| Runtime            | Node.js                                                 | 22.x LTS (`.nvmrc`) — dev/CI pinned |
| Framework          | Next.js (App Router)                                    | **15.5.x**                          |
| UI                 | React                                                   | **19.2.x**                          |
| Styling            | Tailwind CSS                                            | **3.4.x**                           |
| Animation          | Motion (formerly Framer Motion)                         | 11.18.x (`motion` package)          |
| Primitives         | Radix UI (Dialog, Tabs, Dropdown, …)                    | 1.x                                 |
| Forms / validation | React Hook Form + Zod                                   | 7.x / 3.25.x                        |
| ORM                | Prisma                                                  | **6.19.x**                          |
| Database           | PostgreSQL (Neon serverless)                            | —                                   |
| Auth               | Auth.js (NextAuth) Credentials + argon2                 | **5.0.0-beta.31**                   |
| Object storage     | Cloudflare R2 via `@aws-sdk/client-s3`                  | 3.x                                 |
| Image processing   | sharp                                                   | 0.33.x                              |
| Placeholders       | Pexels API                                              | —                                   |
| Bot protection     | Cloudflare Turnstile                                    | —                                   |
| Email              | Nodemailer (Zoho SMTP or similar)                       | 6.x                                 |
| Package manager    | pnpm                                                    | 9.x                                 |
| Lint/format        | ESLint 9 (flat config) + Prettier + Husky + lint-staged | —                                   |
| CI                 | GitHub Actions (lint · typecheck · build · audit)       | —                                   |

> **A note on "latest stable":** Auth.js v5 is the only App-Router-native option and
> ships under a `beta` tag despite being the de-facto standard; it is used deliberately
> (documented in [§13](#13-design-decisions--trade-offs)). Tailwind **v3.4** was chosen
> over v4 to match the config-file token format and avoid the v4 CSS-first migration —
> also documented below.

---

## 3. Architecture at a glance

```
Browser
  │
  ├─ Public site (SSG/ISR, revalidate 1h)  ── reads ──▶ lib/content.ts ──▶ Prisma ──▶ Neon Postgres
  │     • homepage (9 DB-driven sections)                     ▲
  │     • /projects, /services (cursor pagination)            │ safe() fallbacks → empty states
  │     • right-side Drawer  ── fetch ──▶ /api/detail ────────┘
  │     • contact form  ── POST ──▶ /api/contact ─▶ Turnstile + rate-limit + email + store
  │
  └─ Admin (dynamic, session-guarded, at /{ADMIN_BASE_PATH})
        • Edge middleware gates every admin route (auth.config — no native code)
        • Server Actions do all writes (Zod-validated, session re-checked)
        • Media → sharp resize/compress → Cloudflare R2
```

**Rendering strategy.** Public pages are static/ISR (`revalidate = 3600`) for SEO and
speed; content edits call `revalidatePath` so changes appear without a redeploy. Admin
pages are `force-dynamic`. This is the "hybrid SSG/ISR = SEO + fast, but editable"
requirement made concrete.

**The `safe()` wrapper** (`src/lib/content.ts`) wraps every public read in
try/catch with an empty fallback, so a missing or unreachable database degrades to the
designed empty states rather than a 500 — important on first deploy, before the DB is
migrated/seeded.

---

## 4. The design system

Tokens were extracted **verbatim** from the original `:root` block into
`tailwind.config.ts` and mirrored as CSS variables in `src/styles/globals.css` (so raw
CSS gradients/borders reference them exactly as the source did).

- **Colours:** `teal.{DEFAULT,dark,mid,bright,light,ultra}`, `gold`, `ink.{…}`,
  `surface.{white,off}`, and `line.{DEFAULT,soft}` (named `line`, not `border`, so it
  doesn't collide with Tailwind's `border-*` utilities).
- **Type:** Playfair Display (display) + DM Sans (body), self-hosted via
  `next/font/google` — no render-blocking Google Fonts `<link>` like the original.
- **Shape/motion:** `rounded` defaults to **2px**; shadows are teal-tinted
  (`shadow-card`, `shadow-float`); transitions 200ms; grid-line dividers reproduced with
  a 1px background-gap (`.grid-lines`).
- **Primitives** (`src/components/ui/`): `Button` (primary/outline/cta), `Eyebrow`,
  `StatBlock`, `SkillBar`, `TagPill`, `EmptyState`, `Drawer`, `Reveal`, form fields.
- **Living style guide:** `/dev/style-guide` renders every primitive + swatch. It 404s
  in production and is never linked in nav.

Everything respects `prefers-reduced-motion` (globals.css + Motion's built-in handling).

---

## 5. Data model

Prisma schema: `prisma/schema.prisma`. Content entities all share `order` + `visible`
(and, where they open a drawer, a unique `slug`). Highlights:

- **`Section`** — the **ten** homepage sections; drives order + visibility (edited under
  _Sections_). `hero` is always visible. (Ten, not the spec's nine: the original HTML has
  a "Mon Approche" section the spec omitted; `testimonials` is the reverse — in the spec,
  absent from the original.)
- **`Project` / `Service` / `Offer`** — carry a `slug` for shareable drawer URLs.
  Projects hold `resultsJson` (KPI array) and a `gallery` many-to-many with media.
  `Offer.kind` (`diagnostic` | `formation`) selects which tab of the
  "Diagnostics & Formations" section the offer renders in, and switches its card shape.
- **`ClientLogo`, `ExpertiseItem`, `Testimonial`** — simpler list entities.
- **`MediaAsset`** — one row per image; `source` is `upload` | `pexels` with
  `pexelsId`/`pexelsCredit` for traceability. Referenced by every content type via named
  relations (with the required back-relation arrays).
- **`ContactMessage`** — inbox; stores a **hashed** source IP, never the raw IP.
- **`SiteSettings`** — a `singleton` row (SEO defaults, socials, contact, analytics).
- **`AdminUser`** — single admin; argon2 `passwordHash`.
- **`LoginAttempt`** — audit + rate-limit source (login _and_, via a synthetic
  identifier, contact submissions).

The **seed** (`prisma/seed.ts`) creates the nine sections, the admin user (from env),
and the settings singleton — and **deliberately leaves all content tables empty** so the
empty states are exercised on first run and the client enters real content themselves.

---

## 6. Key UX behaviours & how they work

**Scrollspy nav** (`components/layout/nav.tsx`) — an `IntersectionObserver` highlights
the section in view on `/`; standalone `/projects` and `/services` links highlight by
`usePathname()`. Anchor links smooth-scroll with `scroll-margin-top` equal to the header
height (via a CSS variable), not a hardcoded offset. Mobile collapses to an animated
menu that closes on link-click or Escape.

**Progressive loading** (`components/listing/`) — the server renders the first page (9
items, `order`-sorted); a client `useInfinite` hook observes a sentinel and appends
pages from `/api/projects` / `/api/services` via **Prisma cursor pagination**. Loading
shows skeleton cards sized to the real cards (no layout shift); the end shows a calm
"vous avez tout vu" message, never an endless spinner; errors offer a retry.

**Right-side drawer** (`components/drawer/`) — built on Radix `Dialog` (free focus-trap,
Escape, focus-return). Cards are links that set a shallow query param
(`?project=slug` / `?service=` / `?offer=`); a single `DetailDrawer` mounted in the
public layout reads the param, fetches `/api/detail`, and renders. The URL is therefore
**shareable and refresh-proof**, and browser-back closes the drawer. Closing strips the
param with `router.replace(..., { scroll: false })`, preserving scroll underneath.

**Empty states** — every dynamic list has a designed empty state (`EmptyState`,
public/admin/chip variants). Testimonials additionally **auto-hide** the whole section
when empty (an empty social-proof block hurts trust more than omission).

---

## 7. Security model

Proportionate but real (this is a small site, not a bank):

- **Transport/headers** — HTTPS only; `next.config.mjs` sets CSP, `X-Frame-Options:
DENY`, `Referrer-Policy`, HSTS, `X-Content-Type-Options`, `Permissions-Policy`. The
  CSP allows only self + Pexels images + the R2 host + Turnstile.
- **Obscured admin path** — all admin routes live under `[adminBasePath]`, resolved from
  `ADMIN_BASE_PATH`. The dynamic segment **404s** unless it equals the env value, so the
  path is a single env change to rotate. This isn't the security boundary (auth is) but
  removes the site from lazy `/wp-admin`-style scanners.
- **Auth** — Auth.js Credentials provider, password verified with **argon2id**
  (`@node-rs/argon2`), signed httpOnly session cookies, 8h session. The config is split:
  `auth.config.ts` is edge-safe (used by middleware); `auth.ts` adds the argon2
  provider (Node runtime only).
- **Rate limiting** — DB-backed (`LoginAttempt`): 5 failed logins / 15 min per email or
  IP blocks the 6th; contact form is 5 / hour per IP. All login attempts are logged.
- **Turnstile** — invisible challenge on **both** the login and contact forms; verified
  server-side. Degrades gracefully (skips) when keys are absent, for local dev.
- **Generic errors** — "Invalid email or password" never reveals whether the email
  exists.
- **Server-side everything** — every admin Server Action and admin API route re-checks
  the session (`requireAdmin()`); never trusts a client flag. All input is Zod-validated
  with schemas **shared** between form and server. Uploads are validated by **magic-byte
  sniffing** (not filename) and size-capped before touching R2.
- **Secrets** — only in `.env*` (gitignored) / the host's encrypted store.
- **Supply chain** — Dependabot + `pnpm audit` in CI (fails on high/critical).

---

## 8. Media strategy

Images only, no video (this phase). Uploads are sniffed, auto-rotated, resized to
≤1920px and re-encoded to WebP with `sharp`, then stored in **Cloudflare R2** (zero
egress). **Alt text is required** on upload (Zod-enforced) — this is what keeps
accessibility/SEO holding up as content changes.

Where a real photo is missing, the **Pexels** integration (dashboard → Médias → "chercher
sur Pexels") attaches a tasteful placeholder, stored with `source:"pexels"`, its
`pexelsId`, and the photographer credit, and badged **Pexels** in the library. Every
placeholder is tracked in **`MEDIA_TODO.md`** (a living deliverable — tick items off as
real photos replace them; grep `PEXELS-PLACEHOLDER` for inline markers).

---

## 9. Local setup

**Prerequisites:** Node 22 (`nvm use`), pnpm 9, a Postgres database (Neon free tier).

```bash
pnpm install
cp .env.example .env.local        # then fill in the values below

# minimum to boot: DATABASE_URL, AUTH_SECRET, ADMIN_BASE_PATH, ADMIN_EMAIL, ADMIN_INITIAL_PASSWORD
npx auth secret                   # generates AUTH_SECRET

pnpm prisma migrate dev           # create tables
pnpm db:seed                      # sections + admin user + settings singleton

pnpm dev                          # http://localhost:3000  (admin at /{ADMIN_BASE_PATH})
```

The site boots and renders (empty states everywhere) even before R2/Pexels/Turnstile/
SMTP keys are set — each integration degrades gracefully until configured.

**Scripts:** `pnpm dev | build | start | lint | typecheck | format | db:seed |
prisma:studio`.

---

## 10. Editing content (for the client)

Log in at `https://yourdomain.com/{your-admin-path}`. In the dashboard:

- **Projets / Services / Clients / Expertise / Offres / Témoignages** — "+ Ajouter" to
  create, pencil to edit, eye to show/hide, arrows to reorder, trash to delete. "Mis en
  avant" controls whether a project/service appears in the homepage teaser.
- **Médias** — upload images (alt text required) or attach Pexels placeholders; pick them
  in each record's image field.
- **Messages** — contact-form submissions; expand to read, reply by email, mark read,
  delete. New messages also email `NOTIFY_EMAIL_TO`.
- **Sections** — reorder / hide homepage sections. Changes are live immediately.
- **Réglages** — SEO defaults, contact email/phone, social links, analytics id.

Nothing here requires a developer or a redeploy.

---

## 11. Rotating the admin path & password

- **Path:** change `ADMIN_BASE_PATH` in the host's env vars and redeploy. No code change.
  Avoid dictionary words (`admin`, `login`, `panel`, …); keep it typeable.
- **Password:** the seed sets the initial password from `ADMIN_INITIAL_PASSWORD`; change
  it after first login (a "change password" screen is on the roadmap — until then, re-run
  the seed with a new `ADMIN_INITIAL_PASSWORD` after deleting the `AdminUser` row, or add
  a one-off script). Never leave the initial password in the env after go-live.

---

## 12. Deployment

**Primary target — Cloudflare Workers via OpenNext** (`@opennextjs/cloudflare`), matching
the near-$0/month plan:

```bash
pnpm add -D @opennextjs/cloudflare wrangler
# add a wrangler.jsonc + open-next.config.ts per the adapter docs, then:
npx opennextjs-cloudflare build && npx opennextjs-cloudflare deploy
```

Set all env vars in the Workers dashboard, point the R2 bucket's public URL at
`R2_PUBLIC_URL`, run `pnpm prisma migrate deploy` + `pnpm db:seed` against the production
DB, connect the domain (Cloudflare Registrar), and verify HTTPS + headers + admin login.

**Fallback — Vercel Pro** (if the adapter causes persistent friction): zero-config,
`pnpm build` as the build command, same env vars, ~$20/mo.

CI (`.github/workflows/ci.yml`) runs lint · typecheck · build · `pnpm audit` on every PR.

---

## 13. Design decisions & trade-offs

- **Fidelity over spec, where they conflicted.** The brief was "rebuild, not redesign."
  Two places where `portfolio_vdigital_FINAL.html` and the written spec disagreed were
  resolved **in favour of the HTML**:
  - **Nav** — the original has exactly six anchors + a "Me contacter" CTA. Spec §3.2 also
    asked for standalone `/projects` and `/services` nav links; those were dropped to keep
    the navbar identical. Both pages remain reachable via the teaser "Voir tous les …"
    CTA buttons (spec §5.2).
  - **Offres** — rebuilt as the original's tabbed _Diagnostics | Formations_ section
    (Radix Tabs, replacing the HTML's inline `onclick`, which buys keyboard/focus
    handling), not a generic offer grid. This drove the `Offer.kind` field.
- **Static copy is transcribed verbatim** into `src/content/static-copy.ts` — section
  eyebrows/titles/subs, the Approche steps, the expertise platforms + tools box, the
  client sector pills, contact panel and footer. Do not reword it.
- **The two logos were extracted from base64** in the HTML into `public/vdigital-logo.jpg`
  and `public/award-medal.jpg`, so `next/image` can optimise them. (The award medal is
  declared `image/png` in the HTML but is actually a JPEG — magic-byte sniffing caught it.)
- **Tailwind v3.4, not v4** — the spec provided tokens in the v3 `tailwind.config.ts`
  format; v3.4 matches it directly and avoids the v4 CSS-first migration risk. Marked
  `TODO(decision)` in the config.
- **Auth.js v5 (beta)** — the only App-Router-native option; the `beta` tag is nominal.
  Chosen over rolling our own session handling.
- **Hero/About prose lives in `src/content/static-copy.ts`, not the DB** — the Section 4
  schema models _list_ content, not the rich hero/about/timeline/award prose. Rather than
  block, this copy is kept as clearly-marked editable constants seeded from the original.
  To make it dashboard-editable later, promote it into `SiteSettings` JSON + a small form
  (wiring point: `getSiteSettings()`). Marked `TODO(decision)`; noted in `MEDIA_TODO.md`.
- **Arrays as delimited text in forms** (tags = comma-separated, deliverables/results =
  one per line) — keeps every admin form a plain, robust HTML `<form>` posting to a
  Server Action, with almost no client JS, instead of bespoke tag-editor widgets.
- **Generic list actions** (`(dashboard)/actions.ts`) — one delete/toggle-visibility/
  reorder implementation shared by all six entities via a typed model switch, instead of
  6× duplication. Create/update stay per-entity (their fields differ).
- **DB-backed rate limiting** instead of Redis — a small site doesn't need the extra
  infrastructure; `LoginAttempt` is enough and doubles as an audit log.
- **Drawer over detail routes** — matches the brief and keeps scroll position; the URL
  query param gives shareability without a route per project.

---

## 14. Known gaps & roadmap

Honest list of what a follow-up phase should add:

- **Admin "change password" screen** (currently via seed/env — see §11).
- **Project gallery editing UI** — the schema + drawer support a multi-image gallery, but
  the admin form currently sets only the cover image; multi-select is the next step.
- **Hero/About content editing** — see the `static-copy.ts` decision above.
- **Drag-and-drop reordering** — reordering works via up/down arrows; DnD is a polish
  item.
- **On-demand revalidation granularity** — writes call `revalidatePath` broadly; could be
  narrowed with tags.
- **Analytics provider** — `Analytics` assumes a Plausible-style script and is off by
  default; confirm the provider and widen the CSP accordingly (marked `TODO(decision)`).
- **Lighthouse pass** — structure targets ≥90/95/95; run a real audit against production
  data and close any contrast/keyboard gaps.

---

## 15. Project structure

```
prisma/                     schema.prisma · seed.ts
src/
  app/
    (public)/               homepage, /projects, /services  (+ shared Drawer, Analytics)
    [adminBasePath]/        obscured admin (guarded); (auth) login · (dashboard) CRUD
    api/                    detail · projects · services · contact · auth · admin/*
    robots.ts · sitemap.ts
    dev/style-guide/        dev-only style guide (404 in prod)
  components/
    ui/                     Button, Eyebrow, StatBlock, SkillBar, Drawer, EmptyState, …
    layout/                 Nav (scrollspy), Footer
    sections/               Hero, About, teasers, Clients, Expertise, Offers, …
    cards/ · drawer/ · listing/ · admin/ · seo/
  content/static-copy.ts    hero/about prose (see §13)
  lib/                      prisma · auth(.config) · content · env · r2 · pexels ·
                            image · email · ratelimit · turnstile · password · slug ·
                            admin · validation/*
  styles/globals.css        tokens + component utilities
  middleware.ts             edge auth gate for the admin area
design/                     original portfolio_vdigital_FINAL.html (reference)
MEDIA_TODO.md               placeholder tracker (deliverable)
```

---

Built as a faithful, editable rebuild of the original VDIGITAL identity. Content is data;
the code is just the frame around it.
