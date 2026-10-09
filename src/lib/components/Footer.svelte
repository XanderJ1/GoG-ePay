<script lang="ts">
	import { PORTAL_URL, PORTAL_ADDRESS } from '$lib/config';
</script>

<footer>
	<div class="container footer-main">
		<div>
			<a class="brand" href="/"
				><img
					src="/assets/portal-logo.svg"
					width="46"
					height="46"
					alt=""
				/><span>GoG <b>ePay Services</b><small>GOVERNMENT OF GHANA</small></span
				></a
			>
			<p>Here to help you find your payslip,<br />without the stress.</p>
		</div>
		<div>
			<h3>Get started</h3>
			<a href={PORTAL_URL}>Employee portal</a><a href="/help/register/"
				>Access guide</a
			><a href="/help/understand-payslip/">Understanding your payslip</a>
		</div>
		<div>
			<h3>Need a hand?</h3>
			<a href="/help/">Help & FAQs</a><a href="/security/">Account safety</a><a
				href="/about/">About the service</a
			>
			<a href="/contact/">Contact & support</a><a href="/privacy/">Privacy</a>
		</div>
	</div>
	<div class="container footer-bottom">
		<span>GoG ePay Services · Government of Ghana</span><span
			>{PORTAL_ADDRESS}</span
		>
	</div>
</footer>
