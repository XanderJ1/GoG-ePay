<script lang="ts">
	let {
		name,
	}: { name: 'document' | 'chart' | 'help' | 'menu' | 'close' | 'arrow' } =
		$props();
	const paths = {
		document:
			'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm0 0v6h6M8 13h8M8 17h6',
		chart: 'M4 3v17h17M8 15v-4M13 15V7M18 15V5',
		help: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.1 9a3 3 0 0 1 5.8 1c0 2-3 2-3 4M12 17h.01',
		menu: 'M4 6h16M4 12h16M4 18h16',
		close: 'm6 6 12 12M6 18 18 6',
		arrow: 'M4 12h16m-6-6 6 6-6 6',
	};
</script>

<svg
	class="ui-icon"
	width="24"
	height="24"
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.7"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
	focusable="false">
	<path d={paths[name]} />
</svg>