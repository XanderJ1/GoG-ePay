// Progressive enhancement only: page content and links work without JavaScript.
(() => {
	const settings = document.querySelector('script[data-site-url]').dataset;
	const menu = document.querySelector('.mobile-menu');
	const closeMenu = (restoreFocus) => {
		if (!menu?.open) return;
		menu.open = false;
		if (restoreFocus) menu.querySelector('summary').focus();
	};
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && menu?.open) {
			event.preventDefault();
			closeMenu(true);
		}
	});
	document.addEventListener('pointerdown', (event) => {
		if (menu && !menu.contains(event.target)) closeMenu(false);
	});
	window.addEventListener('resize', () => closeMenu(false));
	document
		.querySelectorAll('header a, .skip')
		.forEach((link) => link.addEventListener('click', () => closeMenu(false)));

	document.querySelectorAll('.walkthrough').forEach((walkthrough) => {
		const panels = Array.from(
			walkthrough.querySelectorAll('[role="tabpanel"]'),
		);
		const tabs = Array.from(walkthrough.querySelectorAll('[role="tab"]'));
		if (!panels.length) return;
		const picker = document.createElement('label');
		picker.className = 'mobile-step-picker';
		picker.append('Choose a step');
		const select = document.createElement('select');
		tabs.forEach((tab, index) => {
			const option = document.createElement('option');
			option.value = index;
			option.textContent = `${index + 1}. ${tab.querySelector('span:nth-child(2)')?.firstChild?.textContent || tab.textContent}`;
			select.append(option);
		});
		picker.append(select);
		walkthrough.prepend(picker);
		function choose(index, focusPanel = true) {
			if (index < 0 || index >= panels.length) return;
			panels.forEach((panel, i) => {
				panel.hidden = i !== index;
			});
			tabs.forEach((tab, i) => {
				tab.setAttribute('aria-selected', String(i === index));
				tab.tabIndex = i === index ? 0 : -1;
			});
			select.value = index;
			if (focusPanel) {
				panels[index].focus({ preventScroll: true });
				panels[index].scrollIntoView({ block: 'start', behavior: 'instant' });
			}
		}
		panels.forEach((panel, index) => {
			panel.tabIndex = 0;
			const heading = panel.querySelector('h3');
			panel.removeAttribute('aria-label');
			panel.setAttribute('aria-labelledby', heading.id);
			const pagination = document.createElement('div');
			pagination.className = 'guide-pagination';
			for (const [label, target, disabled] of [
				['Previous step', index - 1, index === 0],
				['Next step', index + 1, index === panels.length - 1],
			]) {
				const button = document.createElement('button');
				button.textContent = label;
				button.disabled = disabled;
				button.addEventListener('click', () => choose(target));
				if (label === 'Next step') {
					const count = document.createElement('span');
					count.textContent = `${index + 1} of ${panels.length}`;
					pagination.append(count);
				}
				pagination.append(button);
			}
			panel.append(pagination);
		});
		tabs.forEach((tab, index) => {
			tab.addEventListener('click', () => choose(index));
			tab.addEventListener('keydown', (event) => {
				const next = {
					ArrowDown: (index + 1) % tabs.length,
					ArrowRight: (index + 1) % tabs.length,
					ArrowUp: (index + tabs.length - 1) % tabs.length,
					ArrowLeft: (index + tabs.length - 1) % tabs.length,
					Home: 0,
					End: tabs.length - 1,
				}[event.key];
				if (next === undefined) return;
				event.preventDefault();
				choose(next, false);
				tabs[next].focus();
			});
		});
		select.addEventListener('change', () => choose(Number(select.value)));
		walkthrough.classList.add('enhanced');
		walkthrough.querySelector('.guide-tabs').hidden = false;
		choose(0, false);
	});
	document.querySelectorAll('.video-play').forEach((button) =>
		button.addEventListener('click', () => {
			const iframe = document.createElement('iframe');
			iframe.id = 'registration-video';
			iframe.src =
				'https://www.youtube-nocookie.com/embed/wraUiX0C8wk?autoplay=1';
			iframe.title = 'CAGD Employee PayServices Registration tutorial';
			iframe.allow =
				'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
			iframe.referrerPolicy = 'strict-origin-when-cross-origin';
			iframe.allowFullscreen = true;
			iframe.tabIndex = 0;
			button.replaceWith(iframe);
			iframe.focus();
		}),
	);

	if (settings.analyticsEnabled !== 'true') return;
	window.dataLayer ||= [];
	const send = function () {
		window.dataLayer.push(arguments);
	};
	const location = settings.siteUrl + window.location.pathname;
	send('consent', 'update', { analytics_storage: 'granted' });
	send('js', new Date());
	send('config', settings.analyticsId, {
		send_page_view: false,
		page_location: location,
		page_referrer: '',
		allow_google_signals: false,
		allow_ad_personalization_signals: false,
		ignore_referrer: true,
	});
	if (!document.querySelector('script[src*="/gtag/js"]')) {
		const loader = document.createElement('script');
		loader.async = true;
		loader.src = `https://www.googletagmanager.com/gtag/js?id=${settings.analyticsId}`;
		document.head.append(loader);
	}
	function view() {
		send('set', { page_location: location, page_referrer: '' });
		send('event', 'page_view', {
			page_location: location,
			page_path: window.location.pathname,
			page_title: document.title,
			page_referrer: '',
		});
	}
	view();
	window.addEventListener('pageshow', (event) => {
		if (event.persisted) view();
	});
	document.addEventListener('click', (event) => {
		const link =
			event.target instanceof Element ? event.target.closest('a') : null;
		if (link?.href === settings.portalUrl)
			send('event', 'portal_login_click', {
				cta_location: link.closest('header')
					? 'header'
					: link.closest('footer')
						? 'footer'
						: 'content',
				page_location: location,
			});
	});
})();
