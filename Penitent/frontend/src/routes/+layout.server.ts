import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = async ({ fetch }) => {
  try {
    const response = await fetch('/api/v1/catalogue/options');
    return { options: response.ok ? await response.json() : null };
  } catch {
    return { options: null };
  }
};
