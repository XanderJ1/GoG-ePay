# Measured baseline — 12 October 2026

These observations are from the existing production deployment, before this revision is deployed. They are lab measurements, not Ghana field data or ranking measurements.

## Delivery audit

11 canonical sitemap pages and 45 declared assets passed the live audit with no failures. Origin and trailing-slash redirects terminated correctly; missing routes/assets returned 404. Raw report: `reports/live-audit-2026-10-12T11-44-01.089Z.json` (local, ignored).

## Mobile Lighthouse

Lighthouse 13.5.0, Playwright Chromium 156, default mobile simulated throttling; three runs for each page against https://www.epayslipgh.com. Values below are medians.

| Page | Performance | LCP | CLS | Total blocking time |
| --- | ---: | ---: | ---: | ---: |
| Homepage | 80 | 1.41s | 0 | 867ms |
| Registration | 80 | 1.29s | 0 | 869ms |
| Sign-in | 75 | 1.33s | 0 | 1,311ms |

Nine raw reports and run values: `reports/lighthouse/2026-10-12T11-50-33.200Z-baseline/summary.json` and sibling JSON files (local, ignored). No performance-sensitive image or hydration change was made based on these measurements. Repeat against the same deployed host after a performance change; local-versus-live results would not be a valid improvement comparison.

## Tracking issue observed

The sign-in report recorded the direct GA4 loader plus GTM-driven requests to both `gtag/js?id=G-XLNK77DXEZ&cx=c...` and `gtag/destination?id=G-XLNK77DXEZ&cx=c...`. Google tracking resources totalled approximately 666KB transferred in that run. The network also showed an `EpaySlip` analytics event. This is evidence of additional published tag behaviour, not proof of a particular account configuration or count of duplicate page views.

Review GTM-N27FCQBP with its owner: remove duplicate GA4 configuration/destination tags for G-XLNK77DXEZ, confirm the intended events, then verify one page view per navigation in Tag Assistant/DebugView and rerun the nine mobile measurements. The repository retains one direct loader and one GTM container; tests stub the remote scripts and verify the website's explicit sanitized events. They cannot guarantee the behaviour of arbitrary published container tags.

## Account baselines still required

Search Console Ghana query/page/indexing exports, Semrush Ghana mobile ranks and GA4 views/portal-click totals have not been exported in this session. Preserve dated exports for the same 28-day period before deployment. Record missing data as unavailable, not zero. The user previously reported a successful sitemap with eleven discovered pages; this is discovery information, not proof that all eleven are indexed.
