> **14 October 2026 conversion:** The current site is plain HTML/CSS/JavaScript. See [migration notes](PLAIN-HTML-MIGRATION.md) and [README](../README.md) for the replacement file locations and hosting setup. The SvelteKit references below describe the earlier implementation.

# Answer engine content

Eight public pages include short question-and-answer passages backed by the existing service guides. `src/lib/answers.ts` is their single source; `DirectAnswers.svelte` renders the text in prerendered HTML, and the SEO component describes the same questions and answers in JSON-LD. Existing citations, canonical URLs, source links and breadcrumbs remain in place.

Keep answers specific to each page. Verify changes to account setup against the CAGD tutorial and current application. Download controls remain conditional until verified. Do not invent support contacts, reviewer identities or application features. Add substantive update dates when revising the source guides.

The output tests check that every structured question and answer also appears outside scripts in the visible page. No special AI file or FAQ rich-result promise is used. Google states that AI Overviews and AI Mode use the existing SEO foundations and require indexable, snippet-eligible pages: https://developers.google.com/search/docs/appearance/ai-features

After deployment, monitor page indexing, relevant question queries, impressions and clicks in Search Console. AI-feature traffic is included in Web performance reporting; it is not a separate guaranteed placement. Human review and official incoming links remain the next trust improvements.
