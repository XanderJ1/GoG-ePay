<script lang="ts">
	import { PORTAL_URL, PORTAL_ADDRESS } from '$lib/config';
</script>

<aside class="official-domains" aria-label="Official service addresses">
	<h2>Know the official addresses</h2>
	<dl>
		<div>
			<dt>Information & guides</dt>
			<dd><a href="https://gogepayservices.com/">gogepayservices.com</a></dd>
		</div>
		<div>
			<dt>Employee application</dt>
			<dd><a href={PORTAL_URL}>{PORTAL_ADDRESS}</a></dd>
		</div>
		<div>
			<dt>Account authentication</dt>
			<dd>auth.gogepayadmin.com</dd>
		</div>
	</dl>
	<p>
		Start here, open the employee application, then follow its sign-in screen.
		This website never asks for your password.
	</p>
</aside>
