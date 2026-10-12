import type { Handle } from '@sveltejs/kit';
import { ANALYTICS_ENABLED } from '$lib/config';
import { tagHead, tagBody } from '$lib/server/tag-template';
export const handle: Handle = ({ event, resolve }) =>
	resolve(event, {
		transformPageChunk: ({ html }) =>
			html
				.replace('<!-- site-tag-head -->', ANALYTICS_ENABLED ? tagHead : '')
				.replace('<!-- site-tag-body -->', ANALYTICS_ENABLED ? tagBody : ''),
	});
