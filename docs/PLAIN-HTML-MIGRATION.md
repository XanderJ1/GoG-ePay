# SEO notes after the plain HTML conversion

The current website source is `site/`: eleven editable HTML files, a stylesheet and vanilla JavaScript. The HTML itself owns titles, descriptions, canonical URLs, JSON-LD, revision dates, source links and answers. `site/pages.json` lists the existing public paths; the Node packaging script reads those pages to generate sitemap.xml and robots.txt. There is no CMS or framework requirement.

Earlier release and measurement documentation below records the SvelteKit implementation before the 14 October 2026 conversion. Where it mentions src/lib/pages.ts, answers.ts or Svelte components, use the corresponding HTML page in site instead. Reviewers and citations now live in visible HTML and the matching JSON-LD. Do not invent approved identities or revise dates automatically.

Current commands and deployment instructions are in README.md. The competitive release account dependencies and the previously measured baseline remain applicable. Retest live redirects and analytics after deployment. On Vercel change the framework preset from SvelteKit to Other while retaining npm run build and the generated Build Output API output.
