export function getConfig(env = {}) {
	const PORTAL_URL = env.PUBLIC_PORTAL_URL || 'https://gogepayservices.com/';
	const portal = new URL(PORTAL_URL);
	if (portal.protocol !== 'https:')
		throw new Error('PUBLIC_PORTAL_URL must use HTTPS.');
	if (portal.username || portal.password)
		throw new Error('Portal URLs must not contain credentials.');
	if (portal.search || portal.hash)
		throw new Error(
			'Use a stable application entry URL, without authentication parameters.',
		);
	const site = env.PUBLIC_SITE_URL ? new URL(env.PUBLIC_SITE_URL) : null;
	if (
		site &&
		(site.protocol !== 'https:' ||
			site.username ||
			site.password ||
			site.pathname !== '/' ||
			site.search ||
			site.hash)
	)
		throw new Error(
			'PUBLIC_SITE_URL must be an HTTPS origin without a path, query, or credentials.',
		);
	const SITE_URL = site?.origin || '';
	const INDEXABLE = env.PUBLIC_INDEXING === 'true';
	if (env.PUBLIC_INDEXING && !['true', 'false'].includes(env.PUBLIC_INDEXING))
		throw new Error('PUBLIC_INDEXING must be true or false.');
	if (INDEXABLE && !SITE_URL)
		throw new Error(
			'PUBLIC_SITE_URL is required for an indexable production build.',
		);
	const ANALYTICS_ID = env.PUBLIC_ANALYTICS_ID || '';
	if (ANALYTICS_ID && !/^G-[A-Z0-9]+$/.test(ANALYTICS_ID))
		throw new Error('PUBLIC_ANALYTICS_ID must be a GA4 measurement ID.');
	if (SITE_URL === portal.origin && portal.pathname === '/')
		throw new Error(
			'The portal URL must point to the sign-in route or a separate domain, not this landing page.',
		);
	return {
		PORTAL_URL,
		PORTAL_ADDRESS:
			portal.host + (portal.pathname === '/' ? '' : portal.pathname),
		SITE_URL,
		INDEXABLE,
		ANALYTICS_ID,
		ANALYTICS_ENABLED:
			INDEXABLE &&
			env.PUBLIC_ANALYTICS_APPROVED === 'true' &&
			Boolean(ANALYTICS_ID),
	};
}
export function robots(config) {
	return config.INDEXABLE
		? `User-agent: *\nAllow: /\nSitemap: ${config.SITE_URL}/sitemap.xml\n`
		: 'User-agent: *\nDisallow: /\n';
}
export function sitemap(pages, config) {
	const entries = config.INDEXABLE
		? pages
				.filter((page) => page.indexable)
				.map(
					(page) =>
						`<url><loc>${config.SITE_URL}${page.path}</loc><lastmod>${page.updatedAt}</lastmod></url>`,
				)
				.join('\n')
		: '';
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}
