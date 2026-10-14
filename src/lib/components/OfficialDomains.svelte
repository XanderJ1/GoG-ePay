<script lang="ts">
	import { PORTAL_URL, PORTAL_ADDRESS, SITE_URL } from '$lib/config';
</script>

<aside class="official-domains" aria-label="Official service addresses">
	<h2>Know the official addresses</h2>
	<p class="official-domains-desc">
		Start here, open the employee application, then follow its sign-in screen.
		This website never asks for your password.
	</p>
	<dl>
		<div>
			<dt>Employee Application</dt>
			<dd><a href={PORTAL_URL}>{PORTAL_ADDRESS}</a></dd>
		</div>
		<div>
			<dt>Account Authentication</dt>
			<dd>auth.gogepayadmin.com</dd>
		</div>
		<div>
			<dt>Information & Guides</dt>
			<dd><a href={SITE_URL || 'https://www.epayslipgh.com'}>www.epayslipgh.com</a></dd>
		</div>
	</dl>
	<div class="official-domains-action">
		<a href={PORTAL_URL} class="official-domains-link">
			Open employee portal <span class="arrow-icon" aria-hidden="true">→</span>
		</a>
	</div>
</aside>
