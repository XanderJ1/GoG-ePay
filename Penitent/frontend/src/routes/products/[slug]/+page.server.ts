import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ fetch, params }) => {
  const response = await fetch(
    '/api/v1/products/' + encodeURIComponent(params.slug),
  );
  if (!response.ok)
    error(
      response.status,
      response.status === 404
        ? 'This piece could not be found.'
        : 'The store is temporarily unavailable.',
    );
  return { product: await response.json() };
};
