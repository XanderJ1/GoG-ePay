<script lang="ts">
	import '../app.css';
	import '$lib/content.css';
	import Analytics from '$lib/components/Analytics.svelte';
	let { children } = $props();
</script>

{@render children()}
<Analytics />
