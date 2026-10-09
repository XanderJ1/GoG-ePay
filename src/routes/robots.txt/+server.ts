import { SITE_URL, INDEXABLE } from '$lib/config';
export const prerender = true;
export function GET() {
	return new Response(
		INDEXABLE
			? 'User-agent: *\nAllow: /\nSitemap: ' + SITE_URL + '/sitemap.xml\n'
			: 'User-agent: *\nDisallow: /\n',
		{ headers: { 'Content-Type': 'text/plain' } },
	);
}
