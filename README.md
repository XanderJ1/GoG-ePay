# GoG ePay Services

Official public information website for Government of Ghana employee payslip access, built with Svelte 5, SvelteKit 2 and TypeScript. The searchable website is **www.epayslipgh.com**; login links open the separate application at **gogepayservices.com**.

## Development and verification

Use Node.js 22.12 or newer.

```powershell
npm ci
npm run dev
npm run check
npm test
npm run build:preview
npm run test:seo
npx playwright install chromium
npm run test:browser
```

For an approved production package use `npm run build:production`, then rerun `npm run test:seo` and `npm run test:browser`. Both build wrappers write complete static output, hosting headers, domain redirects and a 404 page to `build/`. Preview builds are non-indexable. No Node runtime is needed for hosting.

## Structure

- `src/lib/pages.ts`: typed public content, source references, metadata and related links.
- `src/lib/components/SEO.svelte`: canonical URLs, social metadata and structured data.
- `src/routes/[...page]/`: prerendered guide and information pages.
- `src/lib/tutorial.ts`: shared registration and returning-user instructions.
- `src/lib/components/AccessGuide.svelte`: accessible desktop tabs, compact mobile selector and video.
- `scripts/`: deployment packaging, local output server and post-deployment IndexNow submission.

Eleven public pages cover login, registration, recovery, viewing and understanding payslips, official domain safety, support and privacy. The homepage retains the warmer design and original shared anchors. Both complete tutorial flows remain available without JavaScript.

## Configuration and publication

See [the complete SEO launch guide](docs/SEO-LAUNCH.md) and `.env.example`. Public values are baked into each build. Analytics is disabled by default and requires an approved GA4 ID, a production build and visitor consent before loading. This project does not process credentials, migrate the application or administer Keycloak.

Reviewer identities must only be added after actual review. Application migration, official contact confirmation, DNS/hosting, search account verification and official external links are release dependencies; no production deployment or search submission is performed by local builds.

## Tutorial sources and images

Registration follows CAGD's [Employee PayServices Registration video](https://www.youtube.com/watch?v=wraUiX0C8wk) and its [upgraded payslip announcement](https://www.cagd.gov.gh/wp-content/uploads/2026/02/Press-Release-New-Pay-Slip.pdf). The supplied redacted images cover registration entry, employee number, Ghana Card and profile fields. Phone verification, password/security and final review use video chapter links because local screenshots were not supplied. Payslip dashboard guidance remains general until its controls are verified.

The employee photograph is illustrative, AI-generated photography. Its responsive variants use the official Svelte image plugin. Keep screenshots free of personal account information and recheck them against the migrated application before release.

Sanity's SEO/AEO best-practices skill informed the implementation; Sanity CMS is not installed.
