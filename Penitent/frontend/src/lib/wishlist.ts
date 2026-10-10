import { writable } from 'svelte/store';
import { browser } from '$app/env';
function read(): string[] {
  if (!browser) return [];
  try {
    return JSON.parse(localStorage.getItem('penitent-wishlist') || '[]');
  } catch {
    return [];
  }
}
export const wishlist = writable<string[]>(read());
export function toggleWish(slug: string) {
  wishlist.update((values) => {
    const next = values.includes(slug)
      ? values.filter((x) => x !== slug)
      : [...values, slug];
    if (browser)
      localStorage.setItem('penitent-wishlist', JSON.stringify(next));
    return next;
  });
}
