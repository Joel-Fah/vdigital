# DEPLOY.md — taking VDIGITAL live

A start-to-finish runbook. Follow it top to bottom; each stage unlocks the next.
Nothing here requires deep technical knowledge beyond following each provider's
signup flow.

**Target cost:** ~$1–2/month (Zoho Mail) + domain (~$10/yr). Everything else sits
inside a free tier.

> Assumes the code is already on GitHub and `pnpm build` passes locally.

---

## Stage 0 — Pre-flight

```bash
pnpm install
pnpm typecheck && pnpm lint          # both must be clean
pnpm build                           # must exit 0
```

If any of these fail, fix before going further. Never deploy a red build.

---

## Stage 1 — Accounts to create

Create these **in this order**. Keep ownership of every account yourself; give the
developer collaborator access rather than your password.

| #   | Provider                                 | Cost    | What it gives you                                      |
| --- | ---------------------------------------- | ------- | ------------------------------------------------------ |
| 1   | [github.com](https://github.com)         | free    | Code hosting; deploys trigger from here                |
| 2   | [cloudflare.com](https://cloudflare.com) | free    | Hosting (Workers), R2 storage, Turnstile, DNS + domain |
| 3   | Cloudflare Registrar                     | ~$10/yr | The domain itself (at-cost pricing, no markup)         |
| 4   | [neon.tech](https://neon.tech)           | free    | PostgreSQL database                                    |
| 5   | [pexels.com](https://pexels.com/api)     | free    | Placeholder image API key                              |
| 6   | [zoho.com/mail](https://zoho.com/mail)   | ~$1/mo  | Professional mailbox (`contact@yourdomain.com`)        |

---

## Stage 2 — Production database (Neon)

1. In Neon, create a **new project** (or a `production` branch separate from any dev
   database — never reuse the dev DB).
2. Copy **two** connection strings from the dashboard:
   - **Pooled** — host contains `-pooler`. This becomes `DATABASE_URL`.
   - **Direct** — same host _without_ `-pooler`. This becomes `DIRECT_URL` (used by
     migrations).

> ⚠️ **Strip `&channel_binding=require`** from both strings. Prisma's query engine does
> not support it and fails with a misleading `P1001: Can't reach database server`.
> `sslmode=require` still enforces TLS. This will cost you an hour if you miss it.

---

## Stage 3 — Object storage (Cloudflare R2)

Required for image uploads. Without it the dashboard's Media page still works for
Pexels imports but disables uploading, and says so explicitly.

1. Cloudflare dashboard → **R2** → _Create bucket_ (e.g. `vdigital-media`).
2. Bucket → **Settings** → _Public access_ → enable, or connect a custom domain
   like `media.yourdomain.com`. Copy that public base URL → `R2_PUBLIC_URL`.
3. **R2 → Manage API Tokens** → _Create API token_, permission **Object Read & Write**,
   scoped to this bucket. Copy:
   - Access Key ID → `R2_ACCESS_KEY_ID`
   - Secret Access Key → `R2_SECRET_ACCESS_KEY` (shown once — save it now)
4. Account ID is in the R2 sidebar → `R2_ACCOUNT_ID`.
5. Bucket name → `R2_BUCKET_NAME`.

---

## Stage 4 — Bot protection (Cloudflare Turnstile)

Protects the login and contact forms.

1. Cloudflare dashboard → **Turnstile** → _Add site_.
2. Domain: your production domain. Widget mode: **Managed** (invisible).
3. Copy **Site Key** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and
   **Secret Key** → `TURNSTILE_SECRET_KEY`.

> When these are unset the app _skips_ verification (a dev convenience). In production
> they must be set, or the forms are unprotected.

---

## Stage 5 — Placeholder images (Pexels)

1. [pexels.com/api](https://www.pexels.com/api/) → sign up → **Your API Key**.
2. Copy → `PEXELS_API_KEY`.

Without it, the "search Pexels" button is simply hidden.

---

## Stage 6 — Domain + professional mailbox

1. **Cloudflare Registrar** → register your domain (e.g. `vitusahanda.com`). Needs a card
   that works for international payments.
2. **Zoho Mail Lite** → sign up, add your domain, and add the DNS records Zoho gives you
   (MX + SPF `TXT` + DKIM `TXT`) in **Cloudflare → DNS**. Verify.
3. Create the mailbox, e.g. `contact@yourdomain.com`.
4. In Zoho, generate an **app-specific password** (Security → App Passwords). Use that,
   **not** your login password, for SMTP.

Fill in:

```bash
SMTP_HOST=smtp.zoho.com
SMTP_PORT=465
SMTP_USER=contact@yourdomain.com
SMTP_PASSWORD=<zoho app-specific password>
NOTIFY_EMAIL_TO=contact@yourdomain.com
```

If SMTP is unset, contact-form messages **still save to the admin inbox** — you just get
no email alert.

---

## Stage 7 — Generate the remaining secrets

```bash
npx auth secret        # → AUTH_SECRET
```

Choose your obscured admin path. **Simple but non-obvious** — avoid `admin`, `login`,
`dashboard`, `panel`, `cms`, `manage`. Something typeable like `studio-vd` or `backstage`.

```bash
ADMIN_BASE_PATH=studio-vd
ADMIN_EMAIL=you@yourdomain.com
ADMIN_INITIAL_PASSWORD=<a long random password>
```

`ADMIN_INITIAL_PASSWORD` is used **once**, by the seed, to hash your password. Clear it
from the environment after first login (see Stage 11).

---

## Stage 8 — Full environment variable list

Set every one of these in your hosting platform's encrypted variable store.
**Never commit them.**

```bash
# Database (Neon) — no channel_binding!
DATABASE_URL=postgresql://...-pooler.../neondb?sslmode=require
DIRECT_URL=postgresql://.../neondb?sslmode=require

# Auth
AUTH_SECRET=
AUTH_TRUST_HOST=true
ADMIN_BASE_PATH=studio-vd
ADMIN_EMAIL=
ADMIN_INITIAL_PASSWORD=      # remove after first login

# Public URL (canonical, OpenGraph, sitemap)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=https://media.yourdomain.com

# Pexels
PEXELS_API_KEY=

# Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# Email
SMTP_HOST=smtp.zoho.com
SMTP_PORT=465
SMTP_USER=
SMTP_PASSWORD=
NOTIFY_EMAIL_TO=

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_ID=
```

---

## Stage 9 — Migrate + seed production

Run **once**, from your machine, pointed at the production database:

```bash
# Put the production DATABASE_URL / DIRECT_URL / ADMIN_* into .env.production.local
pnpm dotenv -e .env.production.local -- prisma migrate deploy
pnpm dotenv -e .env.production.local -- tsx prisma/seed.ts
```

Expected output:

```
✓ Seeded 10 sections
✓ Admin user ready: you@yourdomain.com
✓ Site settings ready
✓ Done. Content tables left empty by design
```

Content tables are empty **on purpose** — the empty states are designed, and you enter
real content through the dashboard.

---

## Stage 10 — Deploy

### Option A (primary) — Cloudflare Workers via OpenNext

Matches the near-$0/month plan.

```bash
pnpm add -D @opennextjs/cloudflare wrangler
```

Create `wrangler.jsonc`:

```jsonc
{
  "name": "vdigital",
  "main": ".open-next/worker.js",
  "compatibility_date": "2025-03-25",
  "compatibility_flags": ["nodejs_compat"],
  "assets": { "directory": ".open-next/assets", "binding": "ASSETS" },
}
```

Create `open-next.config.ts`:

```ts
import { defineCloudflareConfig } from '@opennextjs/cloudflare';
export default defineCloudflareConfig();
```

Then:

```bash
npx opennextjs-cloudflare build
npx opennextjs-cloudflare deploy
```

Set every Stage 8 variable in **Workers → your worker → Settings → Variables** (mark the
secrets as _Encrypted_). Add your domain under **Custom Domains**.

> `sharp` (image processing) and `@node-rs/argon2` (password hashing) are native modules.
> If the Workers runtime rejects either, don't fight it — switch to Option B. That is
> exactly why the fallback exists.

### Option B (fallback) — Vercel

Requires the **Pro** plan (~$20/mo) for commercial use.

1. Vercel → _Add New Project_ → import the GitHub repo.
2. Framework: **Next.js** (auto-detected). Build command: `pnpm build`.
3. Paste every Stage 8 variable into **Settings → Environment Variables → Production**.
4. Add your domain under **Settings → Domains**, and point Cloudflare DNS at Vercel.

---

## Stage 11 — Post-deploy verification

Work through every line. Do not skip the security checks.

**Public site**

- [ ] `https://yourdomain.com` loads over HTTPS; `http://` redirects to `https://`
- [ ] Logo renders in nav, hero circle, and footer
- [ ] All ten sections render in order (testimonials hidden while empty)
- [ ] Every empty state looks _"not filled in yet"_, never _broken_
- [ ] `/projects` and `/services` load; scrolling loads more; end-of-list message appears
- [ ] Clicking a project/service/offer opens the right-side drawer with a `?project=…`
      URL; refresh keeps it open; browser-back closes it
- [ ] `/sitemap.xml` and `/robots.txt` respond, and robots disallows the admin path

**Security**

- [ ] `https://yourdomain.com/admin` → **404**
- [ ] `https://yourdomain.com/wp-admin` → **404**
- [ ] `https://yourdomain.com/<ADMIN_BASE_PATH>/dashboard` while logged out → redirects to login
- [ ] Login with a **wrong** password 6× rapidly → 6th is blocked with
      _"Trop de tentatives"_
- [ ] Turnstile widget renders on login and contact form
- [ ] Response headers include `Content-Security-Policy`, `X-Frame-Options: DENY`,
      `Strict-Transport-Security`

Quick header check:

```bash
curl -sI https://yourdomain.com | grep -iE "strict-transport|x-frame|content-security"
```

**Dashboard**

- [ ] Log in at `https://yourdomain.com/<ADMIN_BASE_PATH>`
- [ ] **Change your password immediately**, then delete `ADMIN_INITIAL_PASSWORD` from the
      hosting env vars and redeploy
- [ ] Create a project → appears on the homepage teaser and `/projects`
- [ ] Create one Offer of each `kind` → both Diagnostics and Formations tabs populate
- [ ] Upload an image in **Médias** (proves R2 works); alt text is required
- [ ] Search Pexels (proves the Pexels key works)
- [ ] Submit the public contact form → message appears in **Messages** _and_ an email
      arrives at `NOTIFY_EMAIL_TO`
- [ ] **Sections** → hide a section → it disappears from the homepage, no redeploy

**Performance** — run Lighthouse on the homepage. Targets: Performance ≥ 90, SEO ≥ 95,
Accessibility ≥ 95.

---

## Stage 12 — Ongoing operations

**Rotating the admin path.** Change `ADMIN_BASE_PATH` in the host's env vars and redeploy.
No code change. The old path immediately 404s.

**Rotating the admin password.** Until the change-password screen ships, the path is:
delete the `AdminUser` row (Prisma Studio), set a new `ADMIN_INITIAL_PASSWORD`, re-run the
seed, then clear the variable again.

**Rotating leaked credentials.** If a database URL or API key is ever pasted somewhere
public, rotate it at the provider immediately — Neon, R2 and Pexels all support this from
their dashboards.

**Schema changes.** `pnpm prisma migrate dev` locally → commit the generated migration →
`pnpm prisma migrate deploy` against production. Never run `migrate dev` against prod.

**Dependencies.** Dependabot opens weekly PRs; CI runs lint · typecheck · build ·
`pnpm audit` and fails on high/critical vulnerabilities in direct dependencies.

**Backups.** Neon keeps point-in-time restore on the free tier (7 days). For anything
longer, schedule a `pg_dump`.

---

## Troubleshooting

| Symptom                                                      | Cause                                                | Fix                                                                      |
| ------------------------------------------------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------ |
| `P1001: Can't reach database server` (host resolves fine)    | `channel_binding=require` in the connection string   | Remove it. `sslmode=require` still enforces TLS                          |
| `Environment variable not found: DIRECT_URL`                 | Prisma CLI reads `.env`, not `.env.local`            | Use the `dotenv -e <file> --` prefix, as the `pnpm prisma:*` scripts do  |
| `EPERM … query_engine-windows.dll.node` on `prisma generate` | Dev server holds the DLL open                        | Stop `pnpm dev`, then regenerate                                         |
| Media upload disabled in dashboard                           | R2 vars unset                                        | Complete Stage 3                                                         |
| Contact form works but no email                              | SMTP unset or wrong password                         | Use a Zoho **app-specific** password, not the account password           |
| Turnstile always passes locally                              | Keys unset → verification skipped by design          | Set the keys in production                                               |
| Homepage shows empty states after seeding                    | Correct — content tables are seeded empty on purpose | Add content via the dashboard                                            |
| Build succeeds but pages 500 in prod                         | Missing env var at runtime                           | Confirm every Stage 8 variable is set for the **Production** environment |

---

## Rollback

- **Vercel** — _Deployments_ → pick the previous green deployment → _Promote to Production_.
- **Cloudflare Workers** — `npx wrangler rollback`, or redeploy the previous git tag.
- **Database** — Neon → _Restore_ → point-in-time. Restore to a **branch** first and
  inspect it before promoting.

A bad deploy is recoverable. A bad migration against production without a backup is not —
so always take the restore point before Stage 9 on an existing database.
