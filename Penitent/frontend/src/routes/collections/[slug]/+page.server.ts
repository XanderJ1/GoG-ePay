import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ params, fetch, parent }) => {
  const { options } = await parent();
  const collection = options?.collections.find(
    (c: { slug: string }) => c.slug === params.slug,
  );
  if (!collection) error(404, 'Collection not found.');
  const response = await fetch(
    '/api/v1/products?collection=' + encodeURIComponent(params.slug),
  );
  return {
    collection,
    products: response.ok ? (await response.json()).items : [],
    unavailable: !response.ok,
  };
};
