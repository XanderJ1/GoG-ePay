<script>
  import { page } from '$app/state';
</script>

<section class="page-heading">
  <p class="eyebrow">{page.status}</p>
  <h1>A moment of pause.</h1>
  <p>{page.error?.message}</p>
  <a class="button" href="/shop">Return to the collection ↗</a>
</section>
