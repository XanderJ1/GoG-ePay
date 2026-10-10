import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ fetch, url }) => {
  const params = new URLSearchParams(url.searchParams);
  for (const [key, value] of [...params]) if (!value) params.delete(key);
  params.set('pageSize', '8');
  const response = await fetch('/api/v1/products?' + params);
  return {
    catalogue: response.ok ? await response.json() : null,
    error: response.ok
      ? null
      : (await response.json()).title || 'Unable to load products.',
  };
};
