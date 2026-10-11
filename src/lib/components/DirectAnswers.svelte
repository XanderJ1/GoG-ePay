<script lang="ts">
	import { answersByPath } from '$lib/answers';
	let { path }: { path: string } = $props();
	const answers = $derived(answersByPath[path] || []);
</script>

{#if answers.length}
	<section
		class="article-section direct-answers"
		aria-labelledby="direct-answers-heading"
	>
		<h2 id="direct-answers-heading">Quick answers</h2>
		{#each answers as item}
			<article>
				<h3>{item.question}</h3>
				<p>{item.answer}</p>
				<a href={item.guide}>Read the related guide</a>
			</article>
		{/each}
	</section>
{/if}

<style>
	.direct-answers {
		margin-block: 2rem;
		padding: clamp(20px, 4vw, 36px);
		background: var(--soft);
		border: 1px solid var(--line);
		border-radius: 16px;
	}
	article + article {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--line);
	}
	h3 {
		font-size: 1.15rem;
		line-height: 1.4;
	}
	a {
		color: var(--primary);
	}
</style>
