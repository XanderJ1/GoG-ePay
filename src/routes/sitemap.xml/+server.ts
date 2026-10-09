import { SITE_URL } from '$lib/config';
export const prerender = true;
export function GET() {
	const url = (SITE_URL + '/')
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('"', '&quot;');
	return new Response(
		'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
			(SITE_URL ? '<url><loc>' + url + '</loc></url>' : '') +
			'</urlset>',
		{ headers: { 'Content-Type': 'application/xml' } },
	);
}
