# Verification — 10 October 2026

## Executed
- PostgreSQL 17 integration tests: 14 passed. Covers seeded catalogue, sold-out variants, invalid quantities, stock limits, server-owned prices, merged/updated/removed cart lines, isolation/tampered cookies, CSRF/admin access, concurrent additions, checkout validation without inventory changes, changed price/stock/publication, duplicate variants, stale inventory, product creation/update/archive, and production proxy/secure cookies.
- Playwright: 12 passed at 1440, 768, and 375 px in Chromium. Covers full checkout preview, bag refresh persistence, quantities/removal, filters, wishlist refresh, sold-out selection, overflow checks, mobile navigation, product editing, and storefront inventory updates.
- Frontend type/accessibility compiler checks: zero errors and zero warnings.
- Production SvelteKit build: passed.
- Dependency audit: frontend zero advisories; API transitive vulnerability check found no vulnerable packages.
- Compose configuration validation: passed.
- Homepage and product screenshots captured at desktop/tablet/mobile widths and visually reviewed.

Raw local test evidence: TestResults/commerce.trx and frontend/playwright-report/index.html. These generated reports are ignored by Git and can be reproduced with README commands.

## Limits
No paid hosting, remote repository handover, client message, client agreement, or calendar deadline has been established. Render deployment is configured but not executed. Real-device Safari/mobile hardware testing is not performed; mobile coverage uses Chromium emulation. Browser access to reference sites was blocked; see references.md. CI is provided but has not run on GitHub.

Both Docker deployment images build successfully. Production-mode container smoke checks confirm catalogue access through the authenticated proxy, public health checks, and direct API rejection without the proxy secret. Two additional desktop browser journeys passed against the production containers: shopping/checkout and admin inventory editing. The current Playwright HTML report contains this most recent production smoke run; the full 12-case built-server run also passed.




A captioned walkthrough was recorded at docs/videos/penitent-walkthrough.webm, without displaying administrator credentials. Temporary production smoke containers and their private secrets were removed; the local review services remain running.
