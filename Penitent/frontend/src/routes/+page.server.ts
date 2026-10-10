import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ fetch }) => {
  const response = await fetch('/api/v1/products?pageSize=4');
  return {
    products: response.ok ? (await response.json()).items : [],
    unavailable: !response.ok,
  };
};
