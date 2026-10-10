<script lang="ts">
  import { api, money, type Product } from '#lib/api.ts';
  import { toggleWish, wishlist } from '#lib/wishlist.ts';
  let { data } = $props();
  let p = $derived(data.product as Product);
  let colour = $state('');
  let size = $state('');
  let message = $state('');
  let busy = $state(false);
  let selectedColour = $derived(colour || p.variants[0]?.colour || '');
  let variant = $derived(
    p.variants.find((v) => v.colour === selectedColour && v.size === size),
  );
  let colours = $derived([...new Set(p.variants.map((v) => v.colour))]);
  let sizes = $derived([...new Set(p.variants.map((v) => v.size))]);
  let image = $derived(
    p.images.find(
      (i) =>
        i.colourId ===
        p.variants.find((v) => v.colour === selectedColour)?.colourId,
    ) || p.images[0],
  );
  async function add() {
    if (!variant) {
      message = 'Choose your size before adding this piece.';
      return;
    }
    busy = true;
    try {
      await api('/cart/items', 'POST', { variantId: variant.id, quantity: 1 });
      message = 'Added to your bag.';
    } catch (e) {
      message = (e as Error).message;
    } finally {
      busy = false;
    }
  }
</script>

<svelte:head><title>{p.name} — PENITENT</title></svelte:head>
<div class="breadcrumbs">
  <a href="/shop">Shop</a> /
  <a href={'/shop?category=' + p.categorySlug}>{p.category}</a>
  / {p.name}
</div>
<section class="product-detail">
  <div class="detail-gallery">
    {#each p.images as img}<img
        src={img === p.images[0] ? image?.url : img.url}
        alt={img.alt}
        width="1000"
        height="1250"
      />{/each}
    <p class="image-note">
      Illustrative demo imagery. Colour selection is recorded in your bag.
    </p>
  </div>
  <div class="detail-copy">
    <p class="eyebrow">CHAPTER 01 — BECOMING</p>
    <h1>{p.name}</h1>
    <p class="detail-price">{money(p.pricePaise)}</p>
    <p class="muted">Inclusive of tax · Complimentary demo delivery</p>
    <p>{p.description}</p>
    <fieldset>
      <legend>Colour — {selectedColour}</legend>
      <div class="choices">
        {#each colours as c}<button
            class:selected={selectedColour === c}
            aria-pressed={selectedColour === c}
            onclick={() => {
              colour = c;
              size = '';
              message = '';
            }}
            ><span
              class="swatch"
              style:background={p.variants.find((v) => v.colour === c)?.hex}
            ></span>{c}</button
          >{/each}
      </div>
    </fieldset>
    <fieldset>
      <legend>Size</legend>
      <div class="choices">
        {#each sizes as s}{@const v = p.variants.find(
            (v) => v.colour === selectedColour && v.size === s,
          )}<button
            class:selected={size === s}
            disabled={!v || v.stock === 0}
            aria-pressed={size === s}
            onclick={() => {
              size = s;
              message = '';
            }}>{s}{v?.stock === 0 ? ' — sold out' : ''}</button
          >{/each}
      </div>
    </fieldset>
    {#if variant}<p class="muted">
        {variant.stock} available · Stock is not reserved until purchase
      </p>{/if}
    <button
      class="button full"
      disabled={busy || variant?.stock === 0}
      onclick={add}>{busy ? 'Adding…' : 'Add to bag'} <span>↗</span></button
    >
    <p role="status" class="status">
      {message}{#if message === 'Added to your bag.'}
        <a href="/bag">View bag ↗</a>{/if}
    </p>
    <button
      class="text-link"
      aria-pressed={$wishlist.includes(p.slug)}
      onclick={() => toggleWish(p.slug)}
      >{$wishlist.includes(p.slug)
        ? '♥ Saved to wishlist'
        : '♡ Save this piece'}</button
    >
    <details>
      <summary>Material & care</summary>
      <p>{p.material}</p>
      <p>{p.care}</p>
    </details>
    <details>
      <summary>Size & fit</summary>
      <p>
        Relaxed everyday fit. Demo guide: S 92–96 cm, M 97–101 cm, L 102–106 cm,
        XL 107–111 cm chest. Measurements are illustrative.
      </p>
    </details>
    <details>
      <summary>Delivery & packaging</summary>
      <p>
        India-only demo. Delivery and gift packaging are complimentary sample
        policies. No real orders are accepted.
      </p>
    </details>
  </div>
</section>
