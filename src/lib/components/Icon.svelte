<script lang="ts">
	let {
		name,
	}: { name: 'document' | 'chart' | 'help' | 'menu' | 'close' | 'arrow' } =
		$props();
</script>

<img
	class="ui-icon"
	src={`/assets/icons/${name}.png`}
	width="24"
	height="24"
	alt=""
	aria-hidden="true"
	draggable="false"
/>
