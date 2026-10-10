<script lang="ts">
  import ProductCard from '#lib/ProductCard.svelte';
  import type { Product } from '#lib/api.ts';
  let { data } = $props();
</script>

<section class="hero">
  <img
    class="hero-image"
    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2200&q=85"
    alt="Editorial streetwear mood: everyday silhouettes in the city"
    width="2200"
    height="1467"
    fetchpriority="high"
  />
  <div class="hero-shade"></div>
  <div class="hero-top">
    <span>PENITENT / CHAPTER 01</span><span>01 — 12</span>
  </div>
  <div class="hero-copy">
    <p class="eyebrow">THE FIRST CHAPTER</p>
    <h1>Always<br /><em>becoming.</em></h1>
    <p>Clothing for the space between<br />who you are and who you will be.</p>
    <a class="button light" href="/collections/becoming"
      >Discover Chapter 01 <span>↗</span></a
    >
  </div>
  <span class="hero-caption">EVERYDAY WEAR. EXTRAORDINARY FEELING.</span>
</section>
<section class="intro">
  <p class="eyebrow">LESS NOISE. MORE MEANING.</p>
  <h2>Wear what<br /><em>feels like you.</em></h2>
  <p>
    Quiet confidence. Considered detail. Pieces that move with you, through the
    ordinary and everything beyond.
  </p>
</section>
<section class="section">
  <div class="section-heading">
    <div>
      <p class="eyebrow">THE EVERYDAY EDIT</p>
      <h2>Considered essentials</h2>
    </div>
    <a class="text-link" href="/shop">Explore all pieces ↗</a>
  </div>
  {#if data.unavailable}<p role="alert">
      The collection is temporarily unavailable. <a href="/shop">Try again</a>.
    </p>{:else}<div class="product-grid">
      {#each data.products as product}<ProductCard
          product={product as Product}
        />{/each}
    </div>{/if}
</section>
<section class="story-panel">
  <div class="story-art">
    <span>01</span>
    <p>A CHAPTER,<br />NOT A CONCLUSION.</p>
  </div>
  <div class="story-copy">
    <p class="eyebrow">THE PENITENT PERSPECTIVE</p>
    <h2>There is beauty<br />in the unfinished.</h2>
    <p>
      We believe getting dressed can be a small act of intention. A moment to
      choose how you meet the world. PENITENT lives in that moment.
    </p>
    <a class="text-link" href="/story">Read our story ↗</a>
  </div>
</section>
