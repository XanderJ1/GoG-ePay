import { error } from '@sveltejs/kit';
import { pages, pageFor } from '$lib/pages';
export const entries = () =>
	pages
		.filter((page) => page.path !== '/')
		.map((page) => ({ page: page.path.slice(1, -1) }));
export function load({ params }: { params: { page: string } }) {
	const page = pageFor('/' + params.page.replace(/\/$/, '') + '/');
	if (!page) error(404, 'Page not found');
	return { page };
}
