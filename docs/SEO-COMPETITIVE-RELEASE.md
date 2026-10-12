# Competitive SEO release and measurement

Implementation date: 12 October 2026. Public site: https://www.epayslipgh.com/.
The existing eleven URLs, SvelteKit prerendering, green/gold branding, CAGD favicon and separate employee application remain in place.

## Implemented controls

- Page registry owns titles, descriptions, explicit revision dates, citations and related navigation. Direct answers have stable IDs and descriptive links. Registration and recovery explain mismatches, unavailable phone numbers and OTP handling; download instructions remain conditional.
- Source references accept `checkedAt` and `supportedSections`. Reviewer records accept `name`, `role`, `reviewedAt` and an optional HTTPS `profileUrl`. These display only when supplied. Build validation rejects invalid/future dates and unsupported references. Do not fill review/check dates without actually completing that review.
- Organization, website, page/article and breadcrumb identities are consistent. The publisher is currently the information website's GoG ePay Services identity, rather than an assertion that CAGD publishes these guides. Replace this with the confirmed operator once approved. Visible answers match structured answers; citations are visible links.
- Production retains default analytics; previews omit GA4 and GTM and emit noindex meta and response headers. Production renders GTM high in head and its fallback immediately after body. Explicit events contain public paths and CTA position, with no query strings or fragments.
- Read-only production audit checks sitemap pages, robots, canonicals, metadata, H1s, assets, slash redirects, origin redirects and genuine 404 responses. It writes a local report and fails on errors; it never submits URLs or changes hosting.
- IndexNow accepts only canonical paths in the generated sitemap. It reads `build` or `.vercel/output/static` (newest generated sitemap), or the explicit `SEO_OUTPUT_DIR`. It rejects query strings, fragments, unknown paths and foreign hosts. It never runs as part of the build.

## Required account and publication work

These are dependencies, not claims that the work has already happened:

1. Provide approved operator name, relationship to CAGD, authorisation evidence and public support route. Then update About, Contact and the publisher identity. Add reviewer records only after an identified reviewer approves the relevant content.
2. Export Search Console Ghana queries and pages for the previous 28 days, with clicks, impressions, CTR, average position and indexing counts. Record export date, date range and device filter. Retain the successful sitemap submission; Keyword Gap's zero is not proof of failed indexing.
3. Export GA4 public page views and `portal_login_click` counts for the same period. Record unavailable or insufficient data explicitly rather than entering zero.
4. Configure Semrush Position Tracking for Ghana, mobile and the actual ranking URLs from gogepayslipgh.com and gogpayslip.com. Export baseline ranks for epayslip, gogepayservices com, gogpayslip, gog payslip, e pay service, epayslip gh login, e payslip login, check my payslip, GoG e-payslip registration, Ghana Card registration and password recovery.
5. Inspect the published GTM container GTM-N27FCQBP. Since this site sends GA4 events directly, remove any second Google tag/page-view sender targeting G-XLNK77DXEZ. Disable GA4 enhanced-measurement history page views and unwanted outbound/form measurement. Confirm with Tag Assistant and GA4 DebugView on the deployed site. Local tests cannot inspect unpublished or account-only tag settings.
6. Verify redacted application screenshots and current registration/recovery instructions with the application team. Add exact download steps only when those controls are confirmed.

## Baseline and tools

The read-only live audit on 12 October 2026 passed for 11 pages and 45 assets with zero failures. This checks the current deployed site, not the unpublished revision. Raw reports are in ignored `reports/` and should be retained with dated account exports outside Git.

| Tool | Workflow |
| --- | --- |
| Search Console | Weekly Ghana query/page analysis, compare matching periods and mobile devices; investigate persistent indexing failures |
| Semrush | Daily Ghana mobile rank tracking, weekly comparison by actual ranking URL |
| Screaming Frog | Crawl after significant releases; export status, links, canonicals, duplicate metadata and image alternatives |
| PageSpeed/Lighthouse | Three comparable mobile runs for homepage, registration and sign-in before and after performance changes; compare medians on the same host |
| Bing Webmaster Tools | Import verified ownership, submit the canonical sitemap, review indexing |
| IndexNow | Explicit submission of changed canonical paths only after the matching production deployment |

Run mobile measurement with Lighthouse installed separately, setting `LIGHTHOUSE_CLI` to its CLI entry file and `CHROME_PATH` to Chrome if needed:

```powershell
node scripts/measure-mobile.mjs https://www.epayslipgh.com baseline
node scripts/measure-mobile.mjs https://www.epayslipgh.com after-release
```

Optional `LIGHTHOUSE_PORT` connects to an already running debugging browser. The script produces nine mobile lab reports and per-page median performance, LCP, CLS and total blocking time. Lab total blocking time is not field INP. Compare identical Lighthouse/browser versions and avoid concurrent machine-heavy work. Field targets at the 75th percentile are LCP ≤2.5s, INP ≤200ms and CLS ≤0.1. Do not compare local and production numbers as a measured release improvement.

## Release checks

```powershell
npm run check
npm test
npm run test:release
npm run build:preview
npm run test:seo
npm run build:production
npm run test:seo
npm run test:browser
```

Browser tests use port 4173; stop an existing preview server first. They cover 320px, 390px, 768px and desktop layouts, mobile navigation, no-JavaScript instructions, metadata navigation and sanitized single analytics events. The SEO checks validate all eleven HTML pages and production/preview tag placement and indexing. Vercel selects `.vercel/output/static`; set `SEO_OUTPUT_DIR` to that directory when checking its output.

Deploy only after the content dependencies are reviewed. After deployment:

```powershell
npm run audit:live
# Explicit, only when the deployed key file is available:
npm run indexnow -- / /help/register/ /help/sign-in/ /help/reset-password/ /help/view-payslip/ /about/
```

Use Search Console's live inspection for substantially revised priority pages, then request indexing. Do not remove the successful sitemap or submit private authentication URLs. Verify tracking in the actual published GTM/GA4 accounts. Preserve the previous deployment for rollback.

## Approved linking package draft

For review by the operator before distribution:

- Homepage: https://www.epayslipgh.com/ — recommended label: **GoG E-Payslip Ghana: access and help**.
- Registration: https://www.epayslipgh.com/help/register/ — recommended label: **GoG e-payslip registration guide**.
- Service description: **Access guidance for Government of Ghana employees, including GoG ePay sign-in, registration, Ghana Card verification and password recovery. Account and payslip actions take place at gogepayservices.com.**

Ask the application owner to add a public help link, and the appropriate CAGD/organisation owners to add approved links from service pages and verified channels. The repository does not imply those links exist, send outreach or buy links.

## Follow-up

Record the actual deployment date. Compare matching windows at deployment +30, +60 and +90 days: Ghana impressions/clicks/CTR, priority-query ranks, indexed canonical pages, portal clicks and available field performance. First resolve persistent indexing issues, then improve guides already gaining impressions. Keep URLs stable; avoid doorway pages, keyword metadata, fabricated reviews and automatic date changes.
