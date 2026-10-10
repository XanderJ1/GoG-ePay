<script lang="ts">
  import type { Product } from './api';
  import { money } from './api';
  import { wishlist, toggleWish } from './wishlist';
  let { product }: { product: Product } = $props();
</script>

<article class="product-card">
  <a href={'/products/' + product.slug} class="product-photo"
    ><img
      src={product.images[0]?.url}
      alt={product.images[0]?.alt || product.name}
      loading="lazy"
      width="700"
      height="900"
    /><span class="photo-label">CHAPTER 01</span></a
  >
  <button
    class="wish"
    aria-label={($wishlist.includes(product.slug) ? 'Remove ' : 'Save ') +
      product.name +
      ' in wishlist'}
    aria-pressed={$wishlist.includes(product.slug)}
    onclick={() => toggleWish(product.slug)}
    >{$wishlist.includes(product.slug) ? '♥' : '♡'}</button
  >
  <div class="product-meta">
    <a href={'/products/' + product.slug}>{product.name}</a><span
      >{money(product.pricePaise)}</span
    >
  </div>
  <p class="muted">
    {product.category} · {new Set(product.variants.map((v) => v.colour)).size} colours
  </p>
</article>
