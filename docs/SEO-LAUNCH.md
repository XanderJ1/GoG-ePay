> **14 October 2026 conversion:** The current site is plain HTML/CSS/JavaScript. See [migration notes](PLAIN-HTML-MIGRATION.md) and [README](../README.md) for the replacement file locations and hosting setup. The SvelteKit references below describe the earlier implementation.

See [the competitive release checklist](SEO-COMPETITIVE-RELEASE.md) for the latest controls, account dependencies and measurement procedure.

# GoG ePay SEO launch and operating guide

## What is implemented

The public information website is **https://www.epayslipgh.com/**. Login links use the existing stable application entry **https://gogepayservices.com/**. Keycloak authentication is started by that application, not by a saved authorization request.

Eleven public pages are prerendered to complete HTML using SvelteKit. A typed page registry supplies metadata, sitemap entries and related navigation. The site has canonical URLs, Open Graph, JSON-LD, responsive hero images and a branded social card. Sanity's `seo-aeo-best-practices` skill informed the content, source and review approach; no Sanity CMS is required.

Default local/preview builds are non-indexable. Do not publish an unreviewed production build just because it passes code checks.

## Build and verify

Use Node 22.12+ and `npm ci`. Run:

```powershell
npm run check
npm test
npm run build:preview
npm run test:seo
npm run build:production
npm run test:seo
npx playwright install chromium
npm run test:browser
```

`build:preview` writes noindex meta tags, noindex response headers and an empty sitemap. `build:production` enables indexing, requires a valid public origin and emits the complete sitemap. Both generate hosting headers, domain redirects and a genuine 404 page. The output is `build/` locally or `.vercel/output/static` on Vercel; no Node runtime is required.

The build commands default to the confirmed domain roles. Explicit environment values override them. Configuration is baked into the output: rebuild after changes. `.env.example` documents all settings. Ordinary `npm run build` now generates the complete indexable production package. Use `npm run build:preview` explicitly for non-indexable preview deployments. For the development server, set the confirmed URLs and `PUBLIC_INDEXING=true` in your local `.env` to inspect the populated sitemap; restart the server after changing environment values.

## Production release dependencies

1. Confirm ownership and TLS for www.epayslipgh.com. Keep the existing application at gogepayservices.com and preserve its working Keycloak callback configuration. Test registration, returning login, recovery and logout using an authorized test account. The application source and Keycloak administration are outside this repository.
2. Have the authorized CAGD reviewer verify every guide, domain and linked support route. Supply the approved reviewer name, role and actual review date; set the reviewer object on each reviewed registry entry only after approval. Revision dates currently record this content implementation, not government review. Check supplied screenshot redaction and whether old images match the migrated application.
3. Verify official organizational wording and the approved operator identity in structured data. CAGD is cited as the service authority; GoG ePay Services currently identifies the information website publisher. Current evidence: CAGD's published upgraded payslip announcement names gogepayservices.com and links the supplied tutorial. Never invent staff profiles, ratings, endorsements or review credentials.
4. Verify the current CAGD contact page. The public guides link that page rather than copying potentially outdated telephone numbers.
5. Review the privacy wording against the actual host's processing and retention. Production analytics remain enabled by default as requested; verify the applicable privacy wording and account settings.

## Cloudflare Pages deployment

Create or reuse the public site's Cloudflare Pages project, preserving the existing site's URLs and account ownership. Framework: SvelteKit static; output directory: `build`; build command: `npm run build:production`. Set `PUBLIC_SITE_URL=https://www.epayslipgh.com` and `PUBLIC_PORTAL_URL=https://gogepayservices.com/` in production.

For preview branches set build command `npm run build:preview` and protect their domains using Cloudflare Access. The generated `_headers` apply noindex to previews, but access protection must be configured in the Cloudflare account. Do not share indexable production output on a public preview hostname.

Attach apex and www domains, enable HTTPS, verify certificate issuance, and enable an edge redirect from HTTP to HTTPS. `_redirects` consolidates apex to www. Verify directory routes normalize to a trailing slash with a single redirect and that an unknown URL returns HTTP 404 rather than the homepage. Check `_app/immutable/` cache headers on the actual CDN.

Before replacing the current public entry point, inventory existing routes and backlinks. Preserve root and the homepage anchors `#main`, `#services`, `#guide`, `#understand`, `#safe`, `#help`. Add exact permanent redirects for any retired public routes after confirming their replacements; do not blanket-redirect all missing pages to the homepage. Keep a copy of the prior approved deployment for rollback.

## Search accounts and baseline

Verify the epayslipgh.com domain property in Google Search Console and Bing Webmaster Tools using DNS. Reuse any existing verified accounts and history. Keep Search Console verification for the application/authentication domains available for diagnosing unexpected indexing; do not submit login or private application pages in the public site's sitemap.

Before release, record the site's current URL inspection, robots, canonical selection, indexed URLs and inbound links. Use Ghana/mobile segmentation where available. Establish the same query set in both engines:

- GoG payslip
- GoG ePay services
- CAGD payslip login
- e payslip Ghana
- GoG payslip registration
- GoG payslip forgot password

Capture competing result URLs, intent, domain confusion and outdated instructions. Search samples observed during planning included gogpayslip.com login pages, CAGD pages, instructional videos and news reporting with inconsistent domain references. These are not a precise Ghana rank report, and their presence does not establish fraud. Do not report a domain merely because it competes in search.

After release submit **https://www.epayslipgh.com/sitemap.xml** to both engines. Inspect homepage, registration and sign-in URLs, confirm rendered HTML and selected canonicals, and request discovery where supported. Submission is not a ranking or indexing guarantee. Do not use Google's restricted Indexing API for these ordinary guide pages.

## Official links and communications

The service owner should arrange links from CAGD's service directory, FAQs and rollout announcement, and from relevant employer pages. Use consistent public-domain wording and links to the specific useful guide. Update the official tutorial description and helpdesk materials to explain the public site → application → authentication journey.

Keep authentic links and accurate citations; do not buy links, generate keyword doorway pages, publish mass unreviewed content or manufacture endorsements. Retain visible FAQs for usefulness; Google retired FAQ rich results in May 2026, so no ranking promise depends on them. Core SEO also supports AI search discovery; an `llms.txt` file is not required by Google.

## Optional visitor analytics

The GA4 integration uses the approved measurement ID `G-XLNK77DXEZ` in production builds and does not load until all conditions hold: indexable production build, valid `PUBLIC_ANALYTICS_ID=G-...`, `PUBLIC_ANALYTICS_APPROVED=true`. The website analytics integration starts automatically without a prompt; previews disable it.

Before enabling, configure the GA4 web stream: disable enhanced measurement and Google Signals/advertising personalization. This integration sends only explicit `page_view` and `portal_login_click` events with clean public paths and CTA position. Do not add authentication parameters, employee fields or cross-domain account tracking. Do not add analytics to Keycloak or the private payslip application as part of this change. Supply approved retention and controller details in the privacy policy before activation.

## IndexNow

This project includes a post-deployment submission helper, not an automatically running task. Generate an IndexNow key, serve its plain-text value at `https://www.epayslipgh.com/<key>.txt`, verify it is reachable, and set `INDEXNOW_KEY` in deployment secrets. After the matching production build is successfully deployed:

```powershell
npm run indexnow -- /help/register/ /help/sign-in/
```

Pass only added or substantively updated canonical public paths present in the generated sitemap. The helper rejects removed or unknown paths. Retry failures in the deployment workflow without re-deploying the site. Do not submit on every visitor request. No submission was made during local implementation. IndexNow supports participating engines such as Bing; it is not a Google submission mechanism.

## Weekly review, then monthly

For the first 12 weeks record indexed canonical pages, Ghana mobile clicks/impressions/CTR/positions by query cluster, monitored branded first-position share, login click-throughs (if enabled), broken links and Core Web Vitals. Search Console averages are not fixed universal rankings. Record AI referrals/citations only where observable.

At days 30, 60 and 90, prioritize indexing failures, then improve weak guides or search snippets using real queries. Review guides quarterly and after application changes. Update dates only after substantive revisions or genuine review. Field performance targets at the 75th percentile: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1. Lab measurements supplement field data; they do not replace it.

Maintain suspected impersonation evidence with URLs, dated screenshots and misleading claims. Authorized personnel can report substantiated violations using the relevant search/ad platform processes. This repository does not send reports or outreach messages.

## Primary references

- [SvelteKit SEO](https://svelte.dev/docs/kit/seo)
- [SvelteKit images](https://svelte.dev/docs/kit/images)
- [Sanity SEO/AEO skill](https://github.com/sanity-io/agent-toolkit/tree/main/skills/seo-aeo-best-practices)
- [Google AI search guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google documentation updates](https://developers.google.com/search/updates)
- [Bing submissions](https://www.bing.com/webmasters/help/URL-Submission-62f2860b)

