<script lang="ts">
  import ProductCard from '#lib/ProductCard.svelte';
  import type { Product, Options } from '#lib/api.ts';
  import { page } from '$app/state';
  let { data } = $props();
  let options = $derived(data.options as Options | null);
  function pageUrl(n: number) {
    const q = new URLSearchParams(page.url.searchParams.toString());
    q.set('page', String(n));
    return '/shop?' + q;
  }
</script>

<svelte:head><title>Shop clothing — PENITENT</title></svelte:head>
<div class="page-heading">
  <p class="eyebrow">CHAPTER 01 / THE COLLECTION</p>
  <h1>Everyday, considered.</h1>
  <p>Distinctive pieces. Effortless silhouettes. Made to be lived in.</p>
</div>
<section class="section shop-section">
  <form class="filters" method="GET" action="/shop">
    <label
      >Category<select
        name="category"
        value={page.url.searchParams.get('category') || ''}
        ><option value="">All clothing</option
        >{#each options?.categories || [] as c}<option value={c.slug}
            >{c.name}</option
          >{/each}</select
      ></label
    >
    <label
      >Size<select name="size" value={page.url.searchParams.get('size') || ''}
        ><option value="">All sizes</option
        >{#each options?.sizes || [] as s}<option>{s.name}</option
          >{/each}</select
      ></label
    >
    <label
      >Colour<select
        name="colour"
        value={page.url.searchParams.get('colour') || ''}
        ><option value="">All colours</option
        >{#each options?.colours || [] as c}<option>{c.name}</option
          >{/each}</select
      ></label
    >
    <label
      >Max price<select
        name="max"
        value={page.url.searchParams.get('max') || ''}
        ><option value="">Any price</option><option value="300000"
          >₹3,000</option
        ><option value="500000">₹5,000</option><option value="700000"
          >₹7,000</option
        ></select
      ></label
    >
    <label
      >Sort<select name="sort" value={page.url.searchParams.get('sort') || ''}
        ><option value="">Collection order</option><option value="price-asc"
          >Price: low to high</option
        ><option value="price-desc">Price: high to low</option><option
          value="name">Name</option
        ></select
      ></label
    >
    <button class="button" type="submit">Apply</button><a href="/shop">Reset</a>
  </form>
  {#if data.error}<p role="alert">
      {data.error} <a href="/shop">Retry</a>
    </p>{:else if data.catalogue}
    <p class="result-count">{data.catalogue.total} considered pieces</p>
    <div class="product-grid">
      {#each data.catalogue.items as product}<ProductCard
          product={product as Product}
        />{/each}
    </div>
    {#if !data.catalogue.total}<p>
        No pieces match your filters. <a href="/shop">Explore all clothing</a>.
      </p>{/if}
    <nav class="pagination" aria-label="Product pages">
      {#each Array(Math.ceil(data.catalogue.total / 8)) as _, i}<a
          href={pageUrl(i + 1)}
          aria-current={data.catalogue.page === i + 1 ? 'page' : undefined}
          >{i + 1}</a
        >{/each}
    </nav>
  {/if}
</section>
