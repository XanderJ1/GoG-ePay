import { SITE_URL, INDEXABLE } from '$lib/config';
import { pages } from '$lib/pages';
export const prerender = true;
export function GET() {
	const escape = (value: string) =>
		value
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('"', '&quot;');
	const urls = INDEXABLE
		? pages
				.filter((page) => page.indexable)
				.map(
					(page) =>
						`<url><loc>${escape(SITE_URL + page.path)}</loc><lastmod>${page.updatedAt}</lastmod></url>`,
				)
				.join('')
		: '';
	return new Response(
		'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
			urls +
			'</urlset>',
		{ headers: { 'Content-Type': 'application/xml' } },
	);
}
