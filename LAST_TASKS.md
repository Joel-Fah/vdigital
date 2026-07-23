# Last tasks before VDIGITAL goes live

Everything in this file requires an account, secret, domain, real portfolio material, or a
decision from you. The application code, admin password-change flow, project-gallery editor,
dependency fixes, and release checks are handled in the repository.

## 1. Create the production services

- Create a **Neon PostgreSQL** production database and save both its pooled runtime URL and
  direct migration URL.
- Create a **Cloudflare R2** bucket for media and expose it through a public custom domain,
  for example `media.yourdomain.com`.
- Create **Cloudflare Turnstile** production keys for your final domain.
- Create a professional mailbox and SMTP/app password for contact notifications and password
  resets.
- Decide whether analytics is needed. If yes, create a Plausible site and keep its domain ID.

## 2. Prepare the production environment

In your hosting provider, create encrypted Production environment variables using
`.env.example` as the source of truth.

Required for launch:

- `DATABASE_URL` and `DIRECT_URL`
- `AUTH_SECRET` (generate a long random secret)
- `AUTH_TRUST_HOST=true`
- a non-obvious `ADMIN_BASE_PATH`
- `ADMIN_EMAIL` and a unique `ADMIN_INITIAL_PASSWORD`
- `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`
- all five R2 variables
- both Turnstile variables
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `NOTIFY_EMAIL_TO`

Optional:

- `NEXT_PUBLIC_ANALYTICS_ID` for Plausible

Never commit these values or paste them into issues, chat, or source files.

## 3. Initialise the production database

From a machine with the production values in a local, uncommitted `.env.production.local`,
run the following once:

```bash
pnpm exec dotenv -e .env.production.local -- prisma migrate deploy
pnpm exec dotenv -e .env.production.local -- tsx prisma/seed.ts
```

The seed creates the section configuration, site settings, and the first admin account. It
intentionally does **not** create demo portfolio content.

## 4. Deploy the application

1. Push this repository, including `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `DEPLOY.md`,
   `MEDIA_TODO.md`, and this file, to your Git host.
2. Import it into a **Node.js-compatible host** such as Vercel. Use Node 22 and `pnpm build`.
   Do not deploy the current application to Cloudflare Workers: it uses Prisma, Argon2, Sharp,
   and SMTP in the Node runtime.
3. Add every Production variable from step 2.
4. Connect `yourdomain.com`, set the required DNS records, and wait for HTTPS to become active.

## 5. First admin setup and real content

1. Go to `https://yourdomain.com/<ADMIN_BASE_PATH>` and sign in.
2. Open **Réglages → Changer le mot de passe**, set a strong new password, then remove
   `ADMIN_INITIAL_PASSWORD` from the host and redeploy.
3. In **Réglages**, enter the final SEO title/description, contact information, social links,
   and optional analytics ID.
4. In **Médias**, upload real, licensed images with accurate alt text.
5. Add the real services, projects, project galleries, clients, expertise items, offers, and
   testimonials. Mark homepage items as visible/featured where appropriate.
6. Replace the hero/About logo stand-in with a real Vitus headshot when available. Track image
   completion in `MEDIA_TODO.md`.

## 6. Validate the live site

- Confirm homepage, `/projects`, `/services`, sitemap, robots file, and all drawers work on
  desktop and mobile.
- Submit the contact form and confirm both the dashboard inbox and notification email receive it.
- Confirm Turnstile appears on login/contact, R2 uploads work, and password reset email arrives.
- Confirm the secret admin path redirects logged-out visitors to login and `/admin` is not used.
- Check response headers, especially CSP, HSTS, and `X-Frame-Options`.
- Run Lighthouse against the populated production site; target Performance ≥90, SEO ≥95, and
  Accessibility ≥95.
- Create a Neon backup/restore routine and configure external uptime/error monitoring.

Once every item above is complete, the portfolio is ready for normal public use.
