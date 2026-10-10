<script lang="ts">
  import { wishlist } from '#lib/wishlist.ts';
  import { api, type Product } from '#lib/api.ts';
  import ProductCard from '#lib/ProductCard.svelte';
  let products = $state<Product[]>([]);
  let error = $state('');
  let loading = $state(false);
  $effect(() => {
    const slugs = [...$wishlist];
    let cancelled = false;
    loading = true;
    Promise.all(slugs.map((s) => api<Product>('/products/' + s)))
      .then((p) => {
        if (!cancelled) {
          products = p;
          error = '';
        }
      })
      .catch(() => {
        if (!cancelled)
          error =
            'A saved piece may no longer be available. Remove it below or try again.';
      })
      .finally(() => {
        if (!cancelled) loading = false;
      });
    return () => {
      cancelled = true;
    };
  });
</script>

<div class="page-heading">
  <p class="eyebrow">KEPT CLOSE</p>
  <h1>Saved pieces</h1>
  <p>Saved on this browser, for when the moment feels right.</p>
</div>
<section class="section">
  {#if error}<p role="alert">{error}</p>
    {#each $wishlist as slug}<button
        onclick={() =>
          wishlist.update((v) => {
            const n = v.filter((s) => s !== slug);
            localStorage.setItem('penitent-wishlist', JSON.stringify(n));
            return n;
          })}>Remove {slug}</button
      >{/each}{:else if loading}<p role="status">
      Finding your pieces…
    </p>{:else if !$wishlist.length}<p>No saved pieces yet.</p>
    <a class="button" href="/shop">Explore the collection ↗</a>{:else}<div
      class="product-grid"
    >
      {#each products as p}<ProductCard product={p} />{/each}
    </div>{/if}
</section>
