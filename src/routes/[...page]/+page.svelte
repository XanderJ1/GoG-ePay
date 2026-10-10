<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import OfficialDomains from '$lib/components/OfficialDomains.svelte';
	import AccessGuide from '$lib/components/AccessGuide.svelte';
	import { PORTAL_URL, ANALYTICS_ENABLED } from '$lib/config';
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
				· Reviewed by {data.page.reviewer}{/if}
		</p>
		{#if data.page.kind === 'guide'}<a class="button" href={PORTAL_URL}
				>Log in to portal</a
			>{/if}
		{#each data.page.sections as section}
			<section class="article-section">
				<h2>{section.heading}</h2>
				{#if data.page.path === '/privacy/' && section.heading === 'Website visits' && ANALYTICS_ENABLED}<p
					>
						Optional Google Analytics measures visits to public guides and
						clicks to the employee application only after you allow it. It
						records clean public page paths and the location of the login
						button. It does not record account credentials, authentication
						links, identity numbers or payslip data. The hosting provider also
						processes ordinary request information to deliver and secure the
						website.
						Google Tag Manager loads when you visit to manage website tags
						and receives ordinary request information.
					</p>
					<p>
						<button
							class="button"
							onclick={() =>
								window.dispatchEvent(new Event('gog-reset-analytics'))}
							>Change analytics choice</button
						>
					</p>{:else}{#each section.paragraphs as paragraph}<p>
							{paragraph}
						</p>{/each}{/if}{#if section.items}<ol>
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
