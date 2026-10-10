<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import { wishlist } from '#lib/wishlist.ts';
  let { children } = $props();
  let menu = $state(false);
</script>

<svelte:head
  ><title>PENITENT — Clothing for becoming</title><meta
    name="description"
    content="Considered streetwear for everyday becoming. Discover PENITENT Chapter 01."
  /></svelte:head
>
<a class="skip" href="#main-content">Skip to content</a>
<div class="announcement">
  CHAPTER 01 — BECOMING <span>Complimentary delivery · Demo collection</span>
</div>
<header>
  <button
    class="menu-toggle"
    aria-expanded={menu}
    aria-controls="mobile-nav"
    onclick={() => (menu = !menu)}>{menu ? 'Close' : 'Menu'}</button
  >
  <a class="wordmark" href="/" aria-label="Penitent home"
    >PENITENT<span>EST. MMXXVI</span></a
  >
  <nav class="desktop-nav" aria-label="Main navigation">
    <a href="/shop" class:active={page.url.pathname === '/shop'}>Shop</a><a
      href="/collections/becoming">Chapter 01</a
    ><a href="/story">Our story</a>
  </nav>
  <nav class="utility" aria-label="Shopping">
    <a href="/wishlist">Saved <span class="count">{$wishlist.length}</span></a
    ><a href="/bag">Bag <span aria-hidden="true">↗</span></a>
  </nav>
</header>
{#if menu}<nav
    id="mobile-nav"
    class="mobile-nav"
    aria-label="Mobile navigation"
  >
    {#each [['/shop', 'Shop all'], ['/shop?category=t-shirts', 'T-shirts'], ['/shop?category=hoodies', 'Hoodies'], ['/shop?category=trousers', 'Trousers'], ['/collections/becoming', 'Chapter 01'], ['/story', 'Our story']] as [href, label]}<a
        {href}
        onclick={() => (menu = false)}>{label} <span>↗</span></a
      >{/each}
  </nav>{/if}
<main id="main-content">{@render children()}</main>
<footer>
  <div class="footer-brand">
    <p class="wordmark">PENITENT</p>
    <p>Made for the everyday.<br />For everything you are becoming.</p>
  </div>
  <div>
    <h2>Explore</h2>
    <a href="/shop">The collection</a><a href="/story">Our story</a><a
      href="/wishlist">Saved pieces</a
    >
  </div>
  <div>
    <h2>Client care</h2>
    <a href="/policies">Delivery & returns</a><a href="/policies#care"
      >Care & sizing</a
    ><a href="/policies#privacy">Privacy</a>
  </div>
  <div>
    <h2>The demo</h2>
    <p>Sample products and policies.<br />No payments or real orders.</p>
    <a href="/admin">Administrator access ↗</a>
  </div>
  <div class="footer-bottom">
    <span>© 2026 PENITENT. Demo experience.</span><span>INDIA · INR</span>
  </div>
</footer>
