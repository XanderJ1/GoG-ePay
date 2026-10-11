<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import {
		ANALYTICS_ID,
		ANALYTICS_ENABLED,
		SITE_URL,
		PORTAL_URL,
	} from '$lib/config';
	let ready = $state(false);
	let lastPath = '';
	const measurementWindow = () => window as Window & { dataLayer?: unknown[] };
	function send(..._args: unknown[]) {
		measurementWindow().dataLayer?.push(arguments);
	}
	function view() {
		if (!ready) return;
		if (lastPath === window.location.pathname) return;
		lastPath = window.location.pathname;
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
	onMount(() => {
		if (!ANALYTICS_ENABLED) return;
		start();
		function trackClick(event: MouseEvent) {
			if (!ready || !(event.target instanceof Element)) return;
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
		document.addEventListener('click', trackClick);
		return () => {
			document.removeEventListener('click', trackClick);
		};
	});
	afterNavigate(() => view());
</script>
