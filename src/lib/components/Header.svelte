<script lang="ts">
	import { PORTAL_URL } from '$lib/config';
	import Icon from './Icon.svelte';
	import { mainLinks } from '$lib/pages';
	let mobileMenu: HTMLDetailsElement;
	function closeMenu(restoreFocus = false) {
		if (!mobileMenu?.open) return;
		mobileMenu.open = false;
		if (restoreFocus) mobileMenu.querySelector('summary')?.focus();
	}
	function handleKey(event: KeyboardEvent) {
		if (event.key === 'Escape' && mobileMenu?.open) {
			event.preventDefault();
			closeMenu(true);
		}
	}
	function handleOutside(event: PointerEvent) {
		if (event.target instanceof Node && !mobileMenu?.contains(event.target))
			closeMenu();
	}
</script>

<svelte:window
	onkeydown={handleKey}
	onpointerdown={handleOutside}
	onresize={() => closeMenu()}
/>
<a class="skip" href="#main" onclick={() => closeMenu()}>Skip to content</a>
<div class="utility">
	<div class="container">
		<span
			><i class="flag" aria-hidden="true"></i> Government of Ghana
			<span class="utility-divider">/</span> Employee Pay Services</span
		><a href="/security/">Staying safe online</a>
	</div>
</div>
{#snippet links()}
	{#each mainLinks as link}<a href={link.path} onclick={() => closeMenu()}
			>{link.label}</a
		>{/each}
	<a class="button small" href={PORTAL_URL} onclick={() => closeMenu()}
		>Log in to portal</a
	>
{/snippet}
<header>
	<div class="container navigation">
		<a
			class="brand"
			href="/"
			aria-label="GoG ePay Services home"
			onclick={() => closeMenu()}
			><img src="/assets/cagd-logo.png" width="49" height="49" alt="Controller and Accountant-General’s Department logo" /><span
				>GoG <b>ePay Services</b><small>FOR THE PEOPLE WHO SERVE GHANA</small
				></span
			></a
		>
		<nav class="desktop-nav" aria-label="Main navigation">
			{@render links()}
		</nav>
		<details class="mobile-menu" bind:this={mobileMenu}>
			<summary aria-label="Toggle navigation"
				><span class="menu-icon"><Icon name="menu" /></span><span
					class="close-icon"><Icon name="close" /></span
				></summary
			>
			<nav aria-label="Mobile navigation">{@render links()}</nav>
		</details>
	</div>
</header>
