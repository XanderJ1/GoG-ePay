import type { components } from './generated/api';
export type Product = components['schemas']['ProductDto'];
export type Cart = components['schemas']['CartDto'];
export type Options = {
  categories: { id: number; name: string; slug: string }[];
  collections: { id: number; name: string; slug: string; story: string }[];
  sizes: { id: number; name: string; sortOrder: number }[];
  colours: { id: number; name: string; hex: string }[];
};
export const money = (paise: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(paise / 100);
export async function api<T>(
  path: string,
  method = 'GET',
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (method !== 'GET') {
    const security = await fetch('/api/v1/security/csrf');
    if (!security.ok)
      throw new Error('Unable to verify your session. Try again.');
    headers['X-CSRF-TOKEN'] = (await security.json()).token;
  }
  const response = await fetch('/api/v1' + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    const problem = await response.json().catch(() => ({}));
    throw new Error(problem.title || 'Unable to complete this request.');
  }
  return response.status === 204 ? (undefined as T) : await response.json();
}

