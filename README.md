# GoG ePay Services — SvelteKit

A Svelte 5 + SvelteKit 2 conversion of the existing GoG ePay landing page. Preserves the design, copy, employee image, portal logo, registration and payslip guides, FAQs and responsive navigation. The page is prerendered to HTML for search engines; Svelte hydrates the menu and guide.

## Run on Windows

Install Node.js 22.12 or newer (Node 24 LTS recommended). Extract the contents of this project into `C:\Users\bash\Desktop\GoG ePay`, so `package.json` sits directly inside that directory. In PowerShell:

```powershell
Set-Location 'C:\Users\bash\Desktop\GoG ePay'
npm ci
npm run dev -- --open
```

The console prints the development URL (normally http://localhost:5173).

```powershell
npm run check
npm test
npm run build
npm run preview -- --open
```

`npm ci` runs `svelte-kit sync`, generating `.svelte-kit/tsconfig.json`. Generated folders and dependencies are intentionally excluded from the archive.

## Project map

- `src/routes/+page.svelte`: landing-page content and metadata.
- `src/lib/components/Header.svelte`: responsive Svelte navigation.
- `src/lib/components/AccessGuide.svelte`: reactive tutorial with arrow-key, Home and End navigation.
- `src/lib/components/Footer.svelte`: footer links.
- `src/lib/config.ts`: login destination shared across the page.
- `src/app.css`: original responsive styling.
- `static/assets/`: existing employee photograph and application logo.
- `src/routes/+layout.ts`: prerendering configuration.

## Login destination

Currently all login buttons point to `https://gogepayservices.com/`, matching the original website. **Before deploying this landing page at that same root URL, set `PUBLIC_PORTAL_URL` in `.env` to the actual portal/authentication route or subdomain**, otherwise those buttons will return visitors to this landing page. This project does not handle credentials or change Keycloak.

## Application screenshots

The original website source includes `employee.webp` (AI-generated illustrative photography) and `portal-logo.svg`. The photograph is unchanged; the logo has been optimized without changing its appearance. The local tutorial folder was reviewed during the UI update. Five supplied, obscured screenshots cover the portal, recovery entry, employee number, Ghana Card and profile screens. Tutorial content lives in `src/lib/tutorial.ts`. Payslip review and sign-out instructions remain general because screenshots of those screens were not supplied.

To add screenshots, copy suitably redacted files into `static/assets/tutorial/`, then reference them as `/assets/tutorial/your-file.png` in `AccessGuide.svelte`. Do not publish employee identifiers, payslip data, login tokens or personal account information.

## Hosting

`npm run build` creates a static `build/` directory that can be served by Nginx or another static host. No Node server is required for the output. The complete HTML includes the title, description, page text and FAQs. Configure the canonical URL, sitemap and indexing rules for the final public domain as part of deployment. The existing private hosted preview was not changed by this conversion.

## Deployment configuration and accessibility

Copy `.env.example` to `.env` and set `PUBLIC_SITE_URL` to the public landing-page origin. Set `PUBLIC_PORTAL_URL` to the existing sign-in destination. These values are baked into the static build; rebuild after changing them. A same-origin portal root fails the build to prevent circular login links. Portal labels are derived from the configured address.

Canonical and social URLs and the sitemap use `PUBLIC_SITE_URL`. Without it, robots.txt disables indexing and the sitemap contains no URLs. Preview deployments should leave it empty.

The mobile navigation uses a native disclosure and works without JavaScript. With JavaScript, it closes on selection, outside taps, resizing and Escape; Escape restores focus. Both tutorials and all their steps remain readable without JavaScript, with keyboard tabs enabled after hydration.

## Registration tutorial source

The registration instructions follow CAGD’s “Employee PayServices Registration” video at https://www.youtube.com/watch?v=wraUiX0C8wk, reviewed alongside its captions and supplied screenshots. Seven written steps cover the portal entry plus the six account stages; each links to its corresponding video timestamp. The video loads from YouTube’s privacy-enhanced player only after Play is selected, with a direct YouTube fallback link. Phone verification, password/security and final review have video links because corresponding local screenshots were not supplied. The separate four-step guide remains available for existing users.
