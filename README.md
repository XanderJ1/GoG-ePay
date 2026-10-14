# GoG ePay Services

Public information website for Government of Ghana employee payslip access, written in **plain HTML, CSS and vanilla JavaScript**. There is no Svelte, TypeScript, Vite, client router or framework runtime.

The public website is https://www.epayslipgh.com/. Login opens the separate employee application at https://gogepayservices.com/.

## Edit the website

- `site/index.html`: homepage.
- `site/help/*/index.html`: registration, sign-in, recovery and payslip guides.
- `site/about/index.html`, `site/contact/index.html`, `site/privacy/index.html`, `site/security/index.html`: information pages.
- `site/assets/site.css`: complete styling, green/gold palette and responsive layouts.
- `site/assets/site.js`: mobile navigation, accessible tutorial steps, click-to-load video and production analytics.
- `site/assets/`: CAGD favicon/logo, PNG icons, screenshots and responsive image variants.
- `site/pages.json`: the eleven public URL paths used for packaging and sitemap generation.

All eleven pages contain complete content, metadata and JSON-LD in their HTML. Edit visible answers and their JSON-LD together; the tests reject inconsistent wording. Update a page's visible revision date and JSON-LD `dateModified` only after substantive changes. Keep canonical URLs and internal links on the trailing-slash paths.

Deployment uses `site/assets/`. The original employee photograph is retained as `site/assets/employee-original.webp` for future image updates. No build-time image processing is required. The optional icon/favicon maintenance scripts use Sharp and Bootstrap's source icons, which are development tools only.

## Run and verify

Use Node.js 22.12+ for development/packaging; Node is not needed on the hosting server.

```powershell
npm ci
npm run dev
```

Development serves a noindex preview at http://127.0.0.1:5173 and rebuilds HTML when files inside `site/` change. Refresh the browser after an edit. Set `PORT` if that port is occupied.

```powershell
npm run check
npm test
npm run test:release
npm run build:preview
npm run test:seo
npm run build
npm run test:seo
npx playwright install chromium
npm run test:browser
```

`npm run build` copies HTML/CSS/JS/images into `build/`, applies production configuration, creates robots.txt/sitemap.xml, redirect rules, response headers and a real 404 page. It performs no compilation or bundling. `npm run preview` serves that output at http://127.0.0.1:4173. Stop another server on 4173 before browser tests.

## Hosting

Upload the **contents of `build/`** to any static host. Use HTTPS and redirect non-www traffic to www. Canonical directory URLs must end with `/`; missing pages and files must return 404 rather than the homepage. Cloudflare Pages can use build command `npm run build` and output directory `build`.

Vercel builds write `.vercel/output/static` plus a Build Output API routing configuration. Set its framework preset to **Other**, keep build command `npm run build`, and leave the output-directory override unset. Keep the existing custom domains. Vercel preview deployments stay noindex and omit tracking. To validate Vercel output, set `SEO_OUTPUT_DIR=.vercel/output/static` before `npm run test:seo`.

## Analytics and SEO

Current CAGD favicons and the social-sharing image use dedicated `cagd-` filenames so browsers can fetch them independently of the retired artwork. Root `favicon.ico` and legacy PNG URLs also contain the current CAGD artwork. Retired SVG logo URLs redirect to the CAGD logo on the configured static hosts. Run `npm run assets:brand` after an approved logo change to regenerate the PNG/ICO/share assets. External search and link-preview caches refresh on their own schedules; a deployment cannot purge those caches.

Production enables GTM `GTM-N27FCQBP` and GA4 `G-XLNK77DXEZ` by default. Preview output removes GTM and disables GA4. `PUBLIC_ANALYTICS_APPROVED=false` disables both. Public settings can come from deployment environment variables or `.env`; the build command controls production/preview indexing.

Native links load complete HTML documents, so each page visit sends one explicit page_view; browser back/forward restores are also measured. Portal links send portal_login_click. Explicit events omit URL query strings, fragments and employee details. Published GTM tags still need account-side review to avoid additional GA4 loaders/events.

Run `npm run audit:live` after deployment to check pages, metadata, redirects and assets. IndexNow is an explicit post-deployment command and only accepts generated sitemap paths. It never runs during building/testing.

See `docs/SEO-COMPETITIVE-RELEASE.md` for release dependencies, external search tools, linking materials and measurement. The code conversion preserves URLs, content and metadata; it does not migrate the application or administer Keycloak. No deployment or search submission is made automatically.
