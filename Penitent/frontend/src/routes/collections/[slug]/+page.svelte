<script lang="ts">
  import ProductCard from '#lib/ProductCard.svelte';
  import type { Product } from '#lib/api.ts';
  let { data } = $props();
</script>

<div class="collection-heading">
  <p class="eyebrow">{data.collection.name}</p>
  <h1>For who you are.<br /><em>And who comes next.</em></h1>
  <p>{data.collection.story}</p>
</div>
<section class="section">
  {#if data.unavailable}<p role="alert">
      Unable to load this collection. Please refresh.
    </p>{:else}<div class="product-grid">
      {#each data.products as p}<ProductCard product={p as Product} />{/each}
    </div>{/if}
</section>
