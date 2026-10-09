// Set these public deployment values in .env before building.
import * as publicEnv from '$env/static/public';
const env: Record<string, string> = publicEnv;
export const PORTAL_URL =
	env.PUBLIC_PORTAL_URL || 'https://gogepayservices.com/';
const portal = new URL(PORTAL_URL);
if (portal.protocol !== 'https:')
	throw new Error('PUBLIC_PORTAL_URL must use HTTPS.');
if (portal.username || portal.password)
	throw new Error('Portal URLs must not contain credentials.');
export const PORTAL_ADDRESS =
	portal.host + (portal.pathname === '/' ? '' : portal.pathname);
const site = env.PUBLIC_SITE_URL ? new URL(env.PUBLIC_SITE_URL) : null;
if (
	site &&
	(site.protocol !== 'https:' ||
		site.username ||
		site.password ||
		site.pathname !== '/' ||
		site.search ||
		site.hash)
) {
	throw new Error(
		'PUBLIC_SITE_URL must be an HTTPS origin without a path, query, or credentials.',
	);
}
export const SITE_URL = site?.origin || '';
if (SITE_URL && SITE_URL === portal.origin && portal.pathname === '/') {
	throw new Error(
		'The portal URL must point to the sign-in route or a separate domain, not this landing page.',
	);
}
