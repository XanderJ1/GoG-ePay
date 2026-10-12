<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import DirectAnswers from '$lib/components/DirectAnswers.svelte';
	import OfficialDomains from '$lib/components/OfficialDomains.svelte';
	import AccessGuide from '$lib/components/AccessGuide.svelte';
	import { PORTAL_URL } from '$lib/config';
	import { pageFor } from '$lib/pages';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<SEO page={data.page} />
<Header />
<main id="main" tabindex="-1">
	<article class="content-page container">
		<nav class="breadcrumbs" aria-label="Breadcrumb">
			<a href="/">Home</a>{#if data.page.kind === 'guide'}<span
					aria-hidden="true">/</span
				><a href="/help/">Help</a>{/if}<span aria-hidden="true">/</span><span
				aria-current="page">{data.page.heading}</span
			>
		</nav>
		<p class="eyebrow">GOVERNMENT OF GHANA · EMPLOYEE PAY SERVICES</p>
		<h1>{data.page.heading}</h1>
		<p class="lead">{data.page.summary}</p>
		<DirectAnswers path={data.page.path} />
		<p class="revision">
			{#if data.page.kind === 'guide'}By GoG ePay Services ·
			{/if}
			Content updated
			<time datetime={data.page.updatedAt}
				>{new Date(data.page.updatedAt).toLocaleDateString('en-GB', {
					timeZone: 'UTC',
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				})}</time
			>{#if data.page.reviewer}
				· Reviewed by
				{#if data.page.reviewer.profileUrl}<a
						href={data.page.reviewer.profileUrl}>{data.page.reviewer.name}</a
					>{:else}{data.page.reviewer.name}{/if},
				{data.page.reviewer.role} on
				<time datetime={data.page.reviewer.reviewedAt}
					>{data.page.reviewer.reviewedAt}</time
				>{/if}
		</p>
		{#if data.page.kind === 'guide'}<a class="button" href={PORTAL_URL}
				>Log in to portal</a
			>{/if}
		{#each data.page.sections as section}
			<section class="article-section">
				<h2>{section.heading}</h2>
				{#each section.paragraphs as paragraph}<p>
						{paragraph}
					</p>{/each}{#if section.items}<ol>
						{#each section.items as item}<li>{item}</li>{/each}
					</ol>{/if}
			</section>
		{/each}
		{#if ['/security/', '/about/', '/help/sign-in/'].includes(data.page.path)}<OfficialDomains
			/>{/if}
		{#if data.page.sources.length}<section class="article-section sources">
				<h2>Official sources</h2>
				<ul>
					{#each data.page.sources as source}<li>
							<a href={source.url}>{source.title}</a>
							{#if source.checkedAt}
								· Checked <time datetime={source.checkedAt}
									>{source.checkedAt}</time
								>{/if}
							{#if source.supportedSections?.length}<p>
									Supports: {source.supportedSections.join('; ')}.
								</p>{/if}
						</li>{/each}
				</ul>
			</section>{/if}
		{#if data.page.related.length}<section class="related-pages">
				<h2>{data.page.kind === 'hub' ? 'Choose a guide' : 'Related help'}</h2>
				<div class="guide-card-grid">
					{#each data.page.related as path}{@const related =
							pageFor(path)}{#if related}<a
								class="guide-card"
								href={related.path}
								><h3>{related.heading}</h3>
								<p>{related.description}</p></a
							>{/if}{/each}
				</div>
			</section>{/if}
	</article>
	{#if data.page.tutorial}{#key data.page.path}<AccessGuide
				initialMode={data.page.tutorial}
				singleMode
			/>{/key}{/if}
</main>
<Footer />
