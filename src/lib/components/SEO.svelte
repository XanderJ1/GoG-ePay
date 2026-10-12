<script lang="ts">
	import { SITE_URL, INDEXABLE } from '$lib/config';
	import type { PublicPage } from '$lib/pages';
	import { answersByPath } from '$lib/answers';
	let { page }: { page: PublicPage } = $props();
	const canonical = $derived(SITE_URL ? SITE_URL + page.path : undefined);
	const schema = $derived(
		SITE_URL
			? {
					'@context': 'https://schema.org',
					'@graph': [
						{
							'@type': 'Organization',
							'@id': SITE_URL + '/#organization',
							name: 'GoG ePay Services',
							url: SITE_URL + '/about/',
							logo: SITE_URL + '/assets/cagd-logo.png',
						},

						{
							'@type': 'WebSite',
							'@id': SITE_URL + '/#website',
							name: 'GoG ePay Services',
							alternateName: 'GoG E-Payslip',
							url: SITE_URL + '/',
							publisher: { '@id': SITE_URL + '/#organization' },
						},

						{
							'@type': page.kind === 'guide' ? 'Article' : 'WebPage',
							'@id': canonical + '#page',
							url: canonical,
							name: page.heading,
							headline: page.heading,
							description: page.description,
							inLanguage: 'en-GH',
							isPartOf: { '@id': SITE_URL + '/#website' },
							...(page.kind !== 'home'
								? { breadcrumb: { '@id': canonical + '#breadcrumbs' } }
								: {}),
							dateModified: page.updatedAt,
							publisher: { '@id': SITE_URL + '/#organization' },
							...(page.kind === 'guide'
								? {
										author: { '@id': SITE_URL + '/#organization' },
										image: SITE_URL + '/assets/social-card.png',
									}
								: {}),
							...(page.reviewer
								? {
										reviewedBy: {
											'@type': 'Person',
											name: page.reviewer.name,
											jobTitle: page.reviewer.role,
											...(page.reviewer.profileUrl
												? { url: page.reviewer.profileUrl }
												: {}),
										},
										lastReviewed: page.reviewer.reviewedAt,
									}
								: {}),
							citation: page.sources.map((source) => source.url),
							...(answersByPath[page.path]?.length
								? {
										mainEntity: answersByPath[page.path].map((item) => ({
											'@type': 'Question',
											'@id': canonical + '#' + item.id,
											name: item.question,
											...(item.sources?.length
												? { citation: item.sources.map((source) => source.url) }
												: {}),
											acceptedAnswer: { '@type': 'Answer', text: item.answer },
										})),
									}
								: {}),
						},
						...(page.kind !== 'home'
							? [
									{
										'@type': 'BreadcrumbList',
										'@id': canonical + '#breadcrumbs',
										itemListElement: [
											{
												'@type': 'ListItem',
												position: 1,
												name: 'Home',
												item: SITE_URL + '/',
											},
											...(page.kind === 'guide'
												? [
														{
															'@type': 'ListItem',
															position: 2,
															name: 'Help',
															item: SITE_URL + '/help/',
														},
													]
												: []),
											{
												'@type': 'ListItem',
												position: page.kind === 'guide' ? 3 : 2,
												name: page.heading,
												item: canonical,
											},
										],
									},
								]
							: []),
					],
				}
			: undefined,
	);
	const serialized = $derived(
		schema ? JSON.stringify(schema).replace(/</g, '\\u003c') : '',
	);
</script>

<svelte:head>
	<title>{page.title}</title>
	<meta name="description" content={page.description} />
	<meta
		name="robots"
		content={INDEXABLE && page.indexable
			? 'index,follow,max-image-preview:large'
			: 'noindex,follow'}
	/>
	<meta name="theme-color" content="#007a3d" />
	<link
		rel="icon"
		href="/assets/favicon-192.png"
		type="image/png"
		sizes="192x192"
	/>
	<link
		rel="icon"
		href="/favicon.ico"
		type="image/x-icon"
		sizes="16x16 32x32 48x48"
	/>
	<link
		rel="apple-touch-icon"
		href="/assets/apple-touch-icon.png"
		sizes="180x180"
	/>
	<meta property="og:title" content={page.title} />
	<meta property="og:description" content={page.description} />
	<meta
		property="og:type"
		content={page.kind === 'guide' ? 'article' : 'website'}
	/>
	<meta property="og:site_name" content="GoG ePay Services" />
	<meta property="og:locale" content="en_GH" />
	<meta name="twitter:card" content="summary_large_image" />
	{#if canonical}
		<link rel="canonical" href={canonical} />
		<meta property="og:url" content={canonical} />
		<meta property="og:image" content={SITE_URL + '/assets/social-card.png'} />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
		<meta
			property="og:image:alt"
			content="GoG ePay Services — Official Government of Ghana E-Payslip Services"
		/>
		<meta name="twitter:image" content={SITE_URL + '/assets/social-card.png'} />
		{@html '<script type="application/ld+json">' + serialized + '</script>'}
	{/if}
</svelte:head>
