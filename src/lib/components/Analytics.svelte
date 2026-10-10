<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import {
		ANALYTICS_ID,
		ANALYTICS_ENABLED,
		SITE_URL,
		PORTAL_URL,
	} from '$lib/config';
	let consent = $state(false);
	let ready = $state(false);
	let showChoice = $state(false);
	const measurementWindow = () => window as Window & { dataLayer?: unknown[] };
	function send(..._args: unknown[]) {
		measurementWindow().dataLayer?.push(arguments);
	}
	function view() {
		if (!ready) return;
		send('set', {
			page_location: SITE_URL + window.location.pathname,
			page_referrer: '',
		});
		send('event', 'page_view', {
			page_location: SITE_URL + window.location.pathname,
			page_path: window.location.pathname,
			page_title: document.title,
			page_referrer: '',
		});
	}
	function start() {
		if (!ANALYTICS_ENABLED || ready) return;
		const win = measurementWindow();
		win.dataLayer ||= [];
		send('consent', 'update', { analytics_storage: 'granted' });
		send('js', new Date());
		send('config', ANALYTICS_ID, {
			send_page_view: false,
			page_location: SITE_URL + window.location.pathname,
			page_referrer: '',
			allow_google_signals: false,
			allow_ad_personalization_signals: false,
			ignore_referrer: true,
		});
		const script = document.createElement('script');
		script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
		script.async = true;
		document.head.append(script);
		ready = true;
		view();
	}
	function choose(allow: boolean) {
		consent = allow;
		showChoice = false;
		try {
			localStorage.setItem('gog-analytics-choice', allow ? 'allow' : 'decline');
		} catch {
			/* Choice still applies for this visit. */
		}
		if (allow) start();
	}
	onMount(() => {
		if (!ANALYTICS_ENABLED) return;
		let stored: string | null = null;
		try {
			stored = localStorage.getItem('gog-analytics-choice');
		} catch {
			/* Ask for this visit when storage is unavailable. */
		}
		consent = stored === 'allow';
		showChoice = stored === null;
		if (consent) start();
		function trackClick(event: MouseEvent) {
			if (!ready || !consent || !(event.target instanceof Element)) return;
			const link = event.target.closest('a');
			if (link?.href === PORTAL_URL)
				send('event', 'portal_login_click', {
					cta_location: link.closest('header')
						? 'header'
						: link.closest('footer')
							? 'footer'
							: 'content',
					page_location: SITE_URL + window.location.pathname,
				});
		}
		function reset() {
			try {
				localStorage.removeItem('gog-analytics-choice');
			} catch {
				/* No stored preference. */
			}
			consent = false;
			window.location.reload();
		}
		document.addEventListener('click', trackClick);
		window.addEventListener('gog-reset-analytics', reset);
		return () => {
			document.removeEventListener('click', trackClick);
			window.removeEventListener('gog-reset-analytics', reset);
		};
	});
	afterNavigate(() => view());
</script>

{#if ANALYTICS_ENABLED && showChoice}
	<aside class="analytics-choice" aria-label="Optional analytics">
		<p>
			Allow optional website analytics? This helps us improve these guides. <a
				href="/privacy/">Privacy details</a
			>
		</p>
		<button onclick={() => choose(false)}>Decline</button><button
			onclick={() => choose(true)}>Allow analytics</button
		>
	</aside>
{/if}
