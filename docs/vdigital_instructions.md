# VDIGITAL Portfolio — Agent Build Instructions

**Project:** Rebuild the VDIGITAL / Vitus Ahanda portfolio as a dynamic, framework-based
web app with a CRUD admin dashboard, starting from the visual identity of the existing
static HTML file (`portfolio_vdigital_FINAL.html`).

**Read this whole file before writing any code.** It is the single source of truth for
scope, stack, design system, security, and build order. Where this file gives a decision,
follow it — do not silently substitute a different library, version, or pattern. Where
something is genuinely ambiguous, leave a `// TODO(decision):` comment and keep moving
rather than blocking on it.

---

## 0. Non-negotiable principles

1. **Preserve the existing visual identity.** Colors, fonts, spacing, border-radius,
   shadows and motion timing all come from the original HTML (extracted in Section 2).
   This is a rebuild, not a redesign.
2. **Content is dynamic, not hard-coded.** Every section listed in Section 3 is backed
   by a database table and editable from the admin dashboard. Nothing user-facing
   should ever require a code change to update.
3. **Every dynamic list has a designed empty state.** Never ship a blank div. See
   Section 6.
4. **No dedicated detail pages for individual projects or services.** Details open in a
   right-side drawer over the current page. See Section 5.3.
5. **Keep the dependency list boring and current-stable.** Prefer the latest _stable_
   (non-beta, non-canary) release of each tool at scaffold time. Do not use
   experimental/unstable flags in production code.
6. **Security is proportionate but real.** This is a small site, not a bank — but the
   admin path is not `/admin`, passwords are hashed, login is rate-limited, and there is
   bot protection on public forms. See Section 8.
7. **Images only, no video, in this phase.** Where a real photo is missing, pull a
   relevant placeholder from the Pexels API, mark it clearly, and log it so the client
   can swap it later. See Section 7.

---

## 1. Tech stack (pinned choices — do not substitute)

| Layer                    | Choice                                                                                     | Why this one                                                                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Language                 | TypeScript (strict mode)                                                                   | Catches content-model bugs at compile time                                                                                              |
| Framework                | **Next.js**, App Router, latest stable major                                               | Hybrid SSG/ISR = SEO + fast, but content stays editable; huge ecosystem, easy to hand over to another developer later                   |
| UI library               | React, latest stable major (matching Next.js peer requirement)                             | Ships with Next.js; no reason to deviate                                                                                                |
| Styling                  | **Tailwind CSS**, latest stable major                                                      | Utility-first, small output, maps directly onto the existing design tokens (Section 2)                                                  |
| Animation                | **Framer Motion** (`motion` package)                                                       | Mature, respects `prefers-reduced-motion`, used for section reveals, drawer transitions, tab switching                                  |
| Component primitives     | **Radix UI primitives** (Dialog, Tabs, DropdownMenu)                                       | Accessible, unstyled, we skin them with Tailwind — avoids reinventing keyboard/focus handling                                           |
| Forms & validation       | **React Hook Form** + **Zod**                                                              | Shared schema between client validation and server-side (API route) validation                                                          |
| ORM                      | **Prisma**                                                                                 | Type-safe queries, clean migrations, easy for a future developer to read the schema                                                     |
| Database                 | **PostgreSQL**, hosted on **Neon** (serverless Postgres)                                   | Generous free tier, branching for safe testing, no need for Supabase's extra features since we're not using Supabase Auth/Storage       |
| Authentication           | **Auth.js** (NextAuth), Credentials provider                                               | Self-hosted, free, single-admin login; passwords hashed with `@node-rs/argon2`                                                          |
| Object storage (images)  | **Cloudflare R2** (S3-compatible) via `@aws-sdk/client-s3`                                 | Zero egress fees, 10GB free, works with any S3 client                                                                                   |
| Placeholder images       | **Pexels API**                                                                             | Free, no attribution required by license but we credit anyway (Section 7)                                                               |
| Bot protection           | **Cloudflare Turnstile**                                                                   | Free, invisible, protects login + contact form                                                                                          |
| Hosting (primary target) | **Cloudflare Workers**, via the **OpenNext Cloudflare adapter** (`@opennextjs/cloudflare`) | Matches the cost plan agreed with the client (near-$0/month); supports Next.js SSR/ISR on Cloudflare's edge                             |
| Hosting (fallback)       | **Vercel** (Pro plan, required for commercial use)                                         | Use only if the Cloudflare adapter causes persistent build/runtime friction — zero-config Next.js hosting, higher monthly cost ($20/mo) |
| Package manager          | **pnpm**                                                                                   | Faster installs, disk-efficient, strict dependency resolution (catches phantom deps)                                                    |
| Linting/formatting       | ESLint + Prettier + Husky + lint-staged                                                    | Pre-commit checks so broken code never reaches `main`                                                                                   |
| CI                       | GitHub Actions                                                                             | Lint + typecheck + build on every PR                                                                                                    |
| Node runtime             | **Node.js 22.x (Active LTS)**                                                              | Pin in `.nvmrc` and `package.json` `engines`                                                                                            |

> Agent note: at scaffold time, run `npx create-next-app@latest` and accept whatever
> current stable defaults it proposes for Next.js/React/Tailwind versions — "latest
> stable" beats a hard-pinned version number that may already be stale by build time.
> Record the exact versions you land on in `package.json` and in a short "Stack Versions"
> note in the project's own `README.md`.

---

## 2. Design system (extracted from the existing HTML — do not invent new tokens)

Source: `portfolio_vdigital_FINAL.html`, `:root` block and component classes.

### 2.1 Color tokens → `tailwind.config.ts`

```ts
colors: {
  teal: {
    DEFAULT: '#1B7A7A',
    dark: '#0D4F4F',
    mid: '#2A9D9D',
    bright: '#3BBFBF',
    light: '#E8F6F6',
    ultra: '#F0FAFA',
  },
  gold: '#C9A84C',
  ink: {
    DEFAULT: '#1A2B2B',   // --text
    mid: '#3D5555',       // --text-mid
    muted: '#7A9898',     // --text-muted
    light: '#A8BFBF',     // --text-light
  },
  surface: {
    white: '#FFFFFF',
    off: '#FAFCFC',
  },
  border: {
    DEFAULT: 'rgba(27,122,122,0.12)',
    soft: 'rgba(27,122,122,0.07)',
  },
}
```

### 2.2 Typography

- Headings / display: **Playfair Display** (serif), weights 400/700, italic used for
  emphasis words within headings (e.g. `<em>` styled as italic + teal).
- Body / UI: **DM Sans** (sans-serif), weights 300/400/500.
- Load both via `next/font/google` (self-hosted by Next.js, no external request,
  better performance than the original's Google Fonts `<link>` tag).
- Keep the existing scale: hero name `clamp(2.2rem, 3.5vw, 3.5rem)`, section titles
  `clamp(1.6rem, 2.2vw, 2rem)`, section eyebrow labels `0.7rem` uppercase with
  `letter-spacing: 3px`.

### 2.3 Shape & motion language

- Border radius is intentionally small and sharp: **2–4px** everywhere (buttons,
  cards, badges) — never use large rounded corners; the circular exceptions are
  avatars/logos and the hero's circular frame device.
- Borders use the translucent teal tokens (`--border`, `--border-soft`), not plain grey.
- Shadows are soft and teal-tinted: `0 8px 40px rgba(27,122,122,0.12)` for elevated
  cards, `0 4px 16px rgba(27,122,122,0.1)` for floating badges.
- Transitions: `0.2s` ease on hover states (background, border-color, transform).
- Section rhythm: generous padding (`5rem`/`6rem` desktop, collapsing to `3rem 1.5rem`
  on mobile at the `768px` breakpoint) — preserve this breathing room; do not compress it.
- Grid-line dividers between repeated items (services grid, KPI grids) are built from a
  1px background gap (`gap:1px; background:var(--border)`), not individual borders —
  replicate this technique with Tailwind (`divide-` utilities or a background-gap grid).

### 2.4 Recurring UI patterns to rebuild as components

| Original class                             | Becomes component                                           | Notes                                                                                                    |
| ------------------------------------------ | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `.nav-cta`, `.btn-primary`, `.btn-outline` | `<Button variant="primary\|outline\|cta">`                  | Same padding/letter-spacing/uppercase treatment                                                          |
| `.hero-tag`, `.sec-label`                  | `<Eyebrow>`                                                 | Small uppercase label with dot or plain, teal color                                                      |
| `.stat`, `.mstat`, `.ckpi`, `.cf-kpi`      | `<StatBlock>`                                               | Reusable numeric-highlight block, used in hero stats bar, about mini-stats, case study KPIs, client KPIs |
| `.service-card`                            | `<ServiceCard>`                                             | Icon + name + description + tag pills                                                                    |
| `.case-card`                               | `<ProjectCard>` (summary) + `<ProjectDrawerContent>` (full) | See Section 5.3                                                                                          |
| `.cf-card` / `.cl-card`                    | `<ClientCard featured \| compact>`                          | Two densities, same as original                                                                          |
| `.skill-bar` / `.skill-fill`               | `<SkillBar>`                                                | Animated width fill on scroll into view                                                                  |
| `.award-card`                              | `<AwardCallout>`                                            | Optional/reusable — treat as a special "highlight" content block, not just Vitus's specific award        |
| `.contact-box`                             | `<ContactPanel>`                                            | Form + direct contact links                                                                              |

Do not rename these visual patterns beyond componentizing them — a returning visitor
should not notice the migration happened, only that it feels faster and more alive.

---

## 3. Information architecture

```
/                        Home — single scrolling page, scrollspy nav (see 3.1)
/projects                 Full project list, progressive loading (see 5.1)
/services                 Full services list, progressive loading (see 5.1)
/{ADMIN_PATH}              Admin login (see Section 8.2 for path)
/{ADMIN_PATH}/dashboard    Admin overview
/{ADMIN_PATH}/projects     CRUD: projects
/{ADMIN_PATH}/services     CRUD: services
/{ADMIN_PATH}/clients      CRUD: client logos
/{ADMIN_PATH}/expertise    CRUD: expertise items
/{ADMIN_PATH}/offers       CRUD: offers/packages
/{ADMIN_PATH}/testimonials CRUD: testimonials
/{ADMIN_PATH}/messages     Inbox: contact-form submissions
/{ADMIN_PATH}/media        Media library (uploads + Pexels-sourced placeholders)
/{ADMIN_PATH}/settings     Site settings (SEO defaults, socials, section order/visibility)
/api/...                   Route handlers backing all of the above
```

### 3.1 Home page sections (scrollspy applies only here)

In on-page order, each independently reorderable/hideable via `Section.order` /
`Section.visible` (Section 4):

1. Hero
2. About
3. Services _(teaser: 4–6 cards + "View all services" → `/services`)_
4. Projects _(teaser: 3–4 featured cards + "View all projects" → `/projects`)_
5. Clients
6. Expertise
7. Offers
8. Testimonials
9. Contact

The client confirmed teasers stay on the homepage and link out to the full pages —
build it this way, not as a hard either/or.

### 3.2 Nav bar behaviour

- Sticky top nav, same frosted-glass style as the original (`backdrop-filter: blur`).
- On `/`: scrollspy via `IntersectionObserver` against each section's wrapper — highlight
  the nav item matching the section currently in view. Clicking a nav item smooth-scrolls
  (`scrollIntoView({behavior: 'smooth', block: 'start'})` with a scroll-margin-top equal
  to the sticky header height, not a raw offset hack).
- Nav also includes plain links to `/projects` and `/services` — these highlight by
  route match (`usePathname()`), not scrollspy, since they're separate pages.
- Mobile: collapses to a hamburger-triggered full-screen or slide-down menu, same links,
  animated open/close with Framer Motion, closes on link click or `Escape`.

---

## 4. Data model (Prisma schema — draft, refine field types as needed)

```prisma
model Section {
  id        String   @id @default(cuid())
  key       String   @unique   // "hero" | "about" | "services" | "projects" | ...
  title     String
  order     Int
  visible   Boolean  @default(true)
  updatedAt DateTime @updatedAt
}

model Project {
  id          String    @id @default(cuid())
  title       String
  client      String?
  category    String?
  summary     String
  resultsJson Json?     // array of {label, value, trend?}
  link        String?
  coverImageId String?
  coverImage  MediaAsset? @relation("ProjectCover", fields: [coverImageId], references: [id])
  gallery     MediaAsset[] @relation("ProjectGallery")
  featured    Boolean   @default(false)   // shows in homepage teaser
  order       Int
  visible     Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Service {
  id          String   @id @default(cuid())
  title       String
  description String
  iconId      String?
  icon        MediaAsset? @relation(fields: [iconId], references: [id])
  tags        String[]
  featured    Boolean  @default(false)
  order       Int
  visible     Boolean  @default(true)
}

model ClientLogo {
  id      String   @id @default(cuid())
  name    String
  sector  String?
  link    String?
  logoId  String?
  logo    MediaAsset? @relation(fields: [logoId], references: [id])
  order   Int
  visible Boolean  @default(true)
}

model ExpertiseItem {
  id          String  @id @default(cuid())
  name        String
  description String?
  level       Int      // 0-100, drives the skill-bar fill
  order       Int
  visible     Boolean  @default(true)
}

model Offer {
  id            String   @id @default(cuid())
  name          String
  description   String
  deliverables  String[]
  priceNote     String?
  imageId       String?
  image         MediaAsset? @relation(fields: [imageId], references: [id])
  order         Int
  visible       Boolean  @default(true)
}

model Testimonial {
  id       String  @id @default(cuid())
  author   String
  role     String?
  company  String?
  quote    String
  photoId  String?
  photo    MediaAsset? @relation(fields: [photoId], references: [id])
  order    Int
  visible  Boolean @default(true)
}

model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  email     String
  subject   String?
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}

model MediaAsset {
  id         String   @id @default(cuid())
  url        String
  altText    String?
  source     String   @default("upload") // "upload" | "pexels"
  pexelsId   String?                      // if source = "pexels", for attribution/traceability
  pexelsCredit String?
  width      Int?
  height     Int?
  uploadedAt DateTime @default(now())
}

model SiteSettings {
  id              String  @id @default("singleton")
  seoTitle        String?
  seoDescription  String?
  socialLinks     Json?
  contactEmail    String?
  contactPhone    String?
  analyticsId     String?
}

model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}

model LoginAttempt {
  id        String   @id @default(cuid())
  identifier String  // email or IP, whichever triggered it
  success   Boolean
  createdAt DateTime @default(now())
}
```

Seed script (`prisma/seed.ts`) must:

1. Create the nine `Section` rows in the order from Section 3.1, `visible: true`.
2. Create one `AdminUser` from `ADMIN_EMAIL` / `ADMIN_INITIAL_PASSWORD` env vars
   (hash the password, never store or log it in plain text).
3. Create a `SiteSettings` singleton row with sensible defaults.
4. Leave `Project`, `Service`, `ClientLogo`, etc. **empty** — this is intentional, so the
   empty states in Section 6 are exercised and visible on first run, and so the client
   populates real content through the dashboard rather than the agent guessing it.

---

## 5. Key UX behaviours

### 5.1 Progressive loading on `/projects` and `/services`

- Server component fetches the first page (e.g. 9 items) sorted by `order`.
- Client component observes a sentinel element near the bottom of the list with
  `IntersectionObserver`; on intersect, calls a paginated API route
  (`GET /api/projects?cursor=...`) using Prisma cursor pagination and appends results.
- While loading the next page: show 3 skeleton cards (pulse animation, matching the
  real card's exact dimensions to avoid layout shift).
- When there are no more items: show a small, calm end-of-list message
  ("You've seen everything for now — check back soon."), not a spinner that never stops.
- If the list is empty on first load: show the empty state from Section 6, not the
  skeletons.

### 5.2 "View all" teaser links

Homepage teaser sections show the top `featured: true` items (fallback: most recent by
`order` if fewer than the target count are marked featured), each linking to
`/projects` or `/services` respectively via a clear CTA button, not just an arrow icon.

### 5.3 Right-side drawer instead of detail pages

- Built on Radix `Dialog` (or a small Vaul-based drawer), anchored to the right edge,
  full height, ~420–520px wide on desktop, full-width on mobile.
- Opens when a `ProjectCard` or `ServiceCard`/`OfferCard` is clicked, from **any**
  context — homepage teaser, `/projects` listing, or `/services` listing.
- On open, update the URL with a shallow query param (`?project=<slug>` or
  `?service=<slug>`) so the state is shareable and survives a refresh/back button,
  without triggering a full page navigation or losing scroll position underneath.
- Content: full description, image gallery (simple lightbox/carousel within the drawer),
  results/KPIs, external link, tags — everything the old design implied a "detail view"
  would need, just presented in the drawer rather than a new route.
- Closes on: overlay click, `Escape`, close button, or browser back (since it's tied to
  the query param).
- Focus is trapped inside the drawer while open and returned to the trigger card on close
  (accessibility — Radix handles most of this, verify it).

---

## 6. Empty states (required for every dynamic list — do not skip)

| Location                 | Empty-state message (tone: warm, first-person from Vitus, not a generic error)                                                                                                            | Suggested visual                                                                                            |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Homepage Services teaser | "Services are being finalised — check back shortly."                                                                                                                                      | Simple line-art icon (e.g. a pen/tools outline), teal-ultra background block matching `.service-card` shape |
| `/services` full page    | "No services published yet. New offerings will appear here as soon as they're ready."                                                                                                     | Same icon, centered, generous vertical padding                                                              |
| Homepage Projects teaser | "Case studies coming soon — recent work is being documented."                                                                                                                             | Card-shaped placeholder using the `.case-card` frame with a muted icon instead of content                   |
| `/projects` full page    | "No projects published yet." + (if admin is logged in only) a subtle "Add your first project →" link into the dashboard                                                                   | Same as above                                                                                               |
| Clients section          | "Client stories will be featured here soon."                                                                                                                                              | Logo-shaped placeholder chip, dashed border                                                                 |
| Expertise section        | "Expertise areas are being added."                                                                                                                                                        | Skeleton skill-bar at 0% width, muted                                                                       |
| Offers section           | "Packages are being put together — get in touch to discuss your needs directly." + Contact CTA                                                                                            | —                                                                                                           |
| Testimonials section     | Hide the entire section automatically if zero testimonials exist (do not show an empty-state box for social proof — an empty testimonials section undermines trust more than omitting it) | n/a                                                                                                         |
| Admin: any list view     | "Nothing here yet — click '+ Add' to create the first one."                                                                                                                               | Simple dashed-border card with a `+` icon, clickable to open the create form directly                       |
| Admin: Messages inbox    | "No messages yet. When someone submits the contact form, it'll show up here."                                                                                                             | Envelope outline icon                                                                                       |
| Admin: Media library     | "No media uploaded yet. Drag and drop images here, or search Pexels for a placeholder."                                                                                                   | Upload-cloud icon                                                                                           |

General rules:

- Never show a raw empty `<table>` or a bare "0 results" — always the designed state above.
- Empty states use the same teal/gold palette and border-radius language as populated
  content, so the site never looks "broken," only "not filled in yet."
- On the public site, empty states are calm and forward-looking (never say "Error" or
  "Nothing found"); in the admin dashboard, they're action-oriented (always offer the
  next step).

---

## 7. Media strategy — Pexels placeholders, images only (no video)

1. For every image slot that has no real client-supplied photo yet (hero background,
   about portrait, project covers/galleries, service icons if illustrative, client
   logos, testimonial photos), query the **Pexels API** for a relevant, tasteful,
   editorial-style photo (e.g. `"marketing team collaboration"`,
   `"digital consultant office Africa"`, `"content creation laptop"`).
2. Store the result as a `MediaAsset` with `source: "pexels"`, `pexelsId`, and
   `pexelsCredit` (photographer name — required by good practice even where the
   Pexels license doesn't mandate it).
3. Wrap every Pexels-sourced image in the markup with a clearly greppable marker, e.g.:
   ```tsx
   {
     /* PEXELS-PLACEHOLDER: hero background — replace via /{ADMIN_PATH}/media */
   }
   ```
4. At the end of the build, generate **`MEDIA_TODO.md`** at the project root, listing
   every placeholder inserted: section/page, what it's standing in for, the Pexels
   photo URL, and a one-line instruction ("Replace via the Media Library in the
   dashboard, Hero section, cover image field"). This file is a deliverable the client
   uses to swap in real photos at their own pace — do not delete it once real images
   are added; instead mark items as done.
5. No stock or placeholder video anywhere in this phase, even where the design
   originally implied motion — a static image is the correct substitute for now.
6. Client-uploaded images (via the dashboard) are resized/compressed on upload (e.g.
   with `sharp` in the API route) to a sensible max width before being stored in R2,
   and always require an `altText` field (enforced by the form's Zod schema) before
   the record can be saved — this is what makes the accessibility and SEO
   non-functional requirements actually hold up over time as content changes.

---

## 8. Security

### 8.1 Baseline

- All traffic HTTPS only (handled automatically by Cloudflare/Vercel).
- Security headers set in `next.config` / middleware: `Content-Security-Policy`,
  `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `Strict-Transport-Security`.
- Environment secrets (`DATABASE_URL`, `AUTH_SECRET`, R2 keys, Pexels key, Turnstile
  keys) live only in `.env.local` locally and in the hosting platform's encrypted
  environment variable store in production — **never committed to git**. Confirm
  `.env*` is in `.gitignore` before the first commit.

### 8.2 Obscured admin path

- The admin path is **not** `/admin`, `/login`, `/wp-admin`, or anything guessable.
- Read it from an environment variable, `ADMIN_BASE_PATH` (e.g. `studio-vd` or
  `backstage`, per the client's stated preference for "simple but non-obvious" —
  avoid pure-random strings so it stays typeable/memorable, but avoid dictionary
  words like `admin`, `login`, `manage`, `dashboard`, `panel`, `cms`).
- All admin routes are generated under this dynamic segment; if the client ever wants
  to rotate it, changing the env var and redeploying is enough — no code change.
- The path itself is _not_ the security boundary — real auth (8.3) is — but it removes
  the site from the very first, laziest wave of automated `/wp-admin`-style scanners.

### 8.3 Authentication hardening

- Single `AdminUser`, credentials provider, password hashed with `argon2` (via
  `@node-rs/argon2`), never stored or logged in plain text.
- Session via Auth.js's signed, httpOnly, secure cookies (default), short-ish session
  lifetime with silent refresh while active.
- **Rate limiting on login**: check `LoginAttempt` records — after 5 failed attempts
  for the same email or IP within 15 minutes, reject further attempts for that window
  with a clear but generic error ("Too many attempts, try again later"). Log every
  attempt (success/failure) to `LoginAttempt` for basic auditability.
- **Cloudflare Turnstile** on the login form and the public contact form — invisible
  challenge, no user friction, blocks the bulk of scripted abuse.
- Generic error messages on failed login ("Invalid email or password") — never reveal
  whether the email exists.

### 8.4 API/data layer

- Every admin API route re-checks the session server-side (never trust a client-side
  "isAdmin" flag alone) before reading/writing.
- All input validated with Zod schemas shared between the form and the API route —
  reject, don't silently coerce, malformed input.
- File uploads validated by real content-type sniffing (not just the filename
  extension) and size-capped before ever reaching R2.
- Contact form messages are rate-limited per IP (basic abuse prevention) in addition
  to the Turnstile check.

### 8.5 Dependency hygiene

- Enable GitHub's Dependabot (free) for automated dependency update PRs.
- `pnpm audit` (or GitHub's built-in advisory scanning) as part of CI — fail the build
  on any high/critical vulnerability in a direct dependency.

---

## 9. Project structure

```
/
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.ts
├─ src/
│  ├─ app/
│  │  ├─ (public)/
│  │  │  ├─ page.tsx                    # Home (SPA sections)
│  │  │  ├─ projects/page.tsx
│  │  │  └─ services/page.tsx
│  │  ├─ [adminBasePath]/               # resolved from ADMIN_BASE_PATH at build/runtime
│  │  │  ├─ (auth)/page.tsx             # login
│  │  │  └─ (dashboard)/...
│  │  └─ api/
│  │     ├─ projects/route.ts
│  │     ├─ services/route.ts
│  │     ├─ contact/route.ts
│  │     └─ ... one folder per resource
│  ├─ components/
│  │  ├─ ui/                            # Button, Eyebrow, StatBlock, Drawer, SkillBar...
│  │  ├─ sections/                      # Hero, About, ServicesTeaser, ProjectsTeaser...
│  │  └─ admin/                         # CRUD tables/forms
│  ├─ lib/
│  │  ├─ prisma.ts
│  │  ├─ auth.ts
│  │  ├─ r2.ts
│  │  ├─ pexels.ts
│  │  ├─ ratelimit.ts
│  │  └─ validation/                    # Zod schemas, one file per entity
│  └─ styles/
│     └─ globals.css
├─ MEDIA_TODO.md                        # generated — see Section 7
├─ .env.example
├─ .nvmrc                               # "22"
├─ tailwind.config.ts
└─ README.md
```

---

## 10. Environment variables (`.env.example` — populate this file for real, do not leave placeholders in production)

```bash
# Database (Neon)
DATABASE_URL=

# Auth.js
AUTH_SECRET=                # generate with `npx auth secret`
ADMIN_BASE_PATH=            # e.g. "studio-vd" — the obscured admin path
ADMIN_EMAIL=                # seed script uses this to create the one admin user
ADMIN_INITIAL_PASSWORD=     # seed script hashes this — change on first login, then remove from env

# Cloudflare R2 (media storage)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

# Pexels (placeholder images)
PEXELS_API_KEY=

# Cloudflare Turnstile (bot protection)
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# Email delivery for contact-form notifications (via Zoho SMTP or a transactional API)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
NOTIFY_EMAIL_TO=            # the professional mailbox that receives contact-form alerts

# Analytics (optional at launch)
NEXT_PUBLIC_ANALYTICS_ID=
```

---

## 11. Build phases (follow in order; each phase should be a separate, reviewable commit/PR)

**Phase 0 — Scaffold**
`create-next-app` (TypeScript, App Router, Tailwind, ESLint) → add Prettier, Husky,
lint-staged → set up `.nvmrc`, `.env.example` → initialize git, first commit.

**Phase 1 — Design system**
Implement `tailwind.config.ts` tokens from Section 2 → load fonts via `next/font` →
build the `components/ui` primitives (Button, Eyebrow, StatBlock, SkillBar, Card
variants) as a small internal style-guide page (`/dev/style-guide`, excluded from
production nav) to visually confirm fidelity to the original before building real pages.

**Phase 2 — Data layer**
Write `schema.prisma` (Section 4) → connect to Neon → run first migration → write and
run `seed.ts` → confirm Prisma Studio shows the seeded `Section` rows and one
`AdminUser`.

**Phase 3 — Public homepage**
Build each section component (Section 3.1) reading from the DB via server components →
implement scrollspy + smooth scroll nav → implement section reveal animations →
implement empty states (Section 6) for every section that could plausibly be empty.

**Phase 4 — Projects & Services full pages**
Build `/projects` and `/services` with cursor pagination + progressive loading
(Section 5.1) → build the shared right-side drawer (Section 5.3) and wire it up from
both the homepage teasers and the full listing pages.

**Phase 5 — Auth & admin shell**
Implement Auth.js credentials provider + argon2 hashing → login page under
`ADMIN_BASE_PATH` → rate limiting (Section 8.3) → Turnstile on login → protected
dashboard shell/navigation.

**Phase 6 — Admin CRUD**
Build create/edit/delete forms + list views for every entity in Section 4, all with
Zod validation and the admin empty states (Section 6) → media library UI (upload +
Pexels search-and-attach) → contact-message inbox → site settings screen → section
visibility/order controls (drag-and-drop).

**Phase 7 — Media pass**
Populate placeholder images via the Pexels integration wherever real content is still
missing (Section 7) → generate `MEDIA_TODO.md`.

**Phase 8 — SEO, a11y, performance pass**
Metadata/OpenGraph per route → `sitemap.xml`/`robots.txt` → schema.org structured data
→ Lighthouse pass (target: Performance ≥ 90, Accessibility ≥ 95) → fix any
color-contrast or keyboard-nav gaps.

**Phase 9 — Deployment**
Attempt Cloudflare Workers deploy via the OpenNext adapter first → if persistently
blocked, fall back to Vercel Pro (Section 1) → wire up the production database and R2
bucket → set all environment variables in the hosting platform → connect the domain
(Section 12) → verify HTTPS, security headers, and that the seeded admin login works
in production.

**Phase 10 — Handover**
Write a short `README.md` covering local setup, how content editing works, and how to
rotate `ADMIN_BASE_PATH`/passwords → walk the client through the dashboard live →
confirm `MEDIA_TODO.md` is understood.

---

## 12. What you (the client) need to set up

Since you're starting from nothing, do these **in this order** — each unlocks the next:

1. **GitHub account** (free) — create one at github.com. This is where the project's
   code will live and where deployment will be triggered from.
2. **Cloudflare account** (free) — create one at cloudflare.com. This gives you: the
   hosting (Workers/Pages), object storage (R2), bot protection (Turnstile), and,
   later, DNS + domain registration in one place.
3. **Domain name** — once you've settled on a name (e.g. `vdigital.com` or
   `vitusahanda.com`), register it through **Cloudflare Registrar** (cheapest, at-cost
   pricing, and keeps DNS + hosting + domain in one dashboard). You'll need a payment
   card that works for international purchases.
4. **Neon account** (free) — create one at neon.tech, create a new Postgres project,
   copy the connection string into `DATABASE_URL`.
5. **Pexels account + API key** (free) — create one at pexels.com, then generate an
   API key from your Pexels account's API page. This powers the placeholder images.
6. **Zoho Mail account** (paid, ~$1/month) — once the domain is registered, sign up
   for Zoho Mail Lite at zoho.com/mail, verify your domain (a few DNS records added
   in Cloudflare), and create your professional mailbox (e.g. `contact@yourdomain.com`).
7. Share access/credentials for the above with the development team as each account is
   created — you keep ownership of every account; the team operates them on your
   behalf under the agreed maintenance arrangement.

Nothing above requires technical knowledge beyond following each provider's signup
flow — we'll guide you through any step that isn't self-explanatory.

---

## 13. Definition of done (checklist)

- [ ] Visual identity matches the original (colors, fonts, spacing, motion) — side by
      side comparison done.
- [ ] All nine homepage sections render from the database, in the order/visibility set
      in `SiteSettings`/`Section`.
- [ ] Scrollspy + smooth scroll works on desktop and mobile.
- [ ] `/projects` and `/services` progressively load with skeleton states and a clear
      end-of-list state.
- [ ] Clicking any project/service/offer card opens the right-side drawer, from every
      entry point, with a shareable URL.
- [ ] Every dynamic list has a working, on-brand empty state (Section 6) — verified by
      temporarily emptying each table.
- [ ] Admin dashboard: full CRUD works for every entity, media upload + Pexels search
      both work, contact messages arrive in the inbox, section reordering/visibility
      works without a redeploy.
- [ ] Admin login lives at the agreed `ADMIN_BASE_PATH`, is rate-limited, and passes a
      basic brute-force test (6th rapid attempt is blocked).
- [ ] Contact form and login both pass through Turnstile.
- [ ] `MEDIA_TODO.md` exists and accurately lists every remaining placeholder.
- [ ] Lighthouse: Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 95 on the homepage.
- [ ] Site is live on the client's domain over HTTPS, with the professional mailbox
      receiving contact-form notifications.
