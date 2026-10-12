<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { PORTAL_URL, PORTAL_ADDRESS } from '$lib/config';
	import SEO from '$lib/components/SEO.svelte';
	import DirectAnswers from '$lib/components/DirectAnswers.svelte';
	import OfficialDomains from '$lib/components/OfficialDomains.svelte';
	import { pages, pageFor } from '$lib/pages';
	import employeeImage from '$lib/assets/employee.webp?format=avif;webp;jpg&w=480;768;1200;1536&enhanced';
</script>

<SEO page={pages[0]} />

<Header />
<main id="main" tabindex="-1">
	<section class="hero">
		<div class="hero-copy">
			<p class="eyebrow">WELCOME TO GOG EPAY SERVICES</p>
			<h1>Official Government of Ghana <em>E-Payslip Services</em></h1>
			<p class="intro">
				Access the official GoG ePay application to check your Government of
				Ghana e-payslip online. Find registration, login and password recovery
				help.
			</p>
			<div class="actions">
				<a class="button" href={PORTAL_URL}>Log in to GoG ePay</a><a
					class="text-link"
					href="#guide">First time? We’ll walk you through it</a
				>
			</div>
			<p class="portal-address">
				The portal lives at <strong>{PORTAL_ADDRESS}</strong>
			</p>
		</div>
		<div class="hero-photo">
			<enhanced:img
				src={employeeImage}
				alt="A professional checking her phone at a courtyard desk"
				sizes="(max-width: 760px) 100vw, 50vw"
				fetchpriority="high"
			/>
			<div class="photo-caption">
				<span>ONE LESS THING TO WORRY ABOUT.</span><strong
					>Check your pay, then get on with your day.</strong
				>
			</div>
		</div>
	</section>
	<div class="quick-bar container">
		<p>What can we help you with?</p>
		<a href={PORTAL_URL}><span>01</span> Open my payslip</a><a href="#guide"
			><span>02</span> Help me sign in</a
		><a href="#help"><span>03</span> I have a question</a>
	</div>
	<section class="section container services" id="services">
		<div class="section-heading">
			<p class="eyebrow">HERE TO MAKE THINGS EASIER</p>
			<h2>Start here.<br />Understand your pay with confidence.</h2>
			<p>
				This page is your friendly starting point. Read a little, ask your
				questions, then head to your account on the portal when you’re ready.
			</p>
		</div>
		<div class="service-grid">
			<article>
				<span class="icon"><Icon name="document" /></span>
				<h3>See your payslip</h3>
				<p>
					Sign in to your employee account to view the payslip information
					available to you.
				</p>
				<a href={PORTAL_URL}>Take me to the portal</a>
			</article>
			<article>
				<span class="icon"><Icon name="chart" /></span>
				<h3>Make sense of the numbers</h3>
				<p>
					Earnings, deductions, net pay. A short, jargon-free explanation before
					you look at your own figures.
				</p>
				<a href="#understand">Explain it simply</a>
			</article>
			<article>
				<span class="icon"><Icon name="help" /></span>
				<h3>Get a hand when you’re stuck</h3>
				<p>
					Trouble signing in? Not sure who to ask? You’ll find straight answers
					and next steps here.
				</p>
				<a href="#help">Find an answer</a>
			</article>
		</div>
	</section>
	<section class="section container" id="guide">
		<p class="eyebrow">OFFICIAL GUIDES</p>
		<h2>Get set up. Find your payslip.</h2>
		<p>Follow the CAGD registration tutorial or choose the help you need.</p>
		<div class="guide-card-grid">
			{#each ['/help/register/', '/help/sign-in/', '/help/reset-password/', '/help/view-payslip/'] as path}{@const guide =
					pageFor(path)}{#if guide}<a class="guide-card" href={guide.path}
						><h3>{guide.heading}</h3>
						<p>{guide.description}</p></a
					>{/if}{/each}
		</div>
		<p><a href="/help/">See all help & guides</a></p>
		<OfficialDomains />
		<p>
			Official service announcement: {#each pages[0].sources as source}<a
					href={source.url}>{source.title}</a
				>{/each}
		</p>
	</section>
	<section class="section container understand" id="understand">
		<div>
			<p class="eyebrow">NO ACCOUNTING DEGREE NEEDED</p>
			<h2>Reading your payslip,<br />made easy.</h2>
			<p class="body-large">
				Every payslip tells the same simple story. Here are the three words
				you’ll see most.
			</p>
			<p class="fine">
				This is a general guide. Your own payslip may use different labels or
				show extra items.
			</p>
		</div>
		<div class="pay-terms">
			<article>
				<span>01</span>
				<div>
					<h3>Gross pay</h3>
					<p>
						What you’ve earned before anything is taken out. Depending on your
						payslip, this may include your basic pay and any allowances.
					</p>
				</div>
			</article>
			<article>
				<span>02</span>
				<div>
					<h3>Deductions</h3>
					<p>
						Money taken from your earnings, like taxes, pension contributions or
						other items listed on your payslip.
					</p>
				</div>
			</article>
			<article>
				<span>03</span>
				<div>
					<h3>Net pay</h3>
					<p>
						What’s left after deductions. Check it against the other figures for
						the same pay period.
					</p>
				</div>
			</article>
			<div class="pay-equation">
				Gross pay <b>−</b> Deductions <b>=</b> Net pay
			</div>
		</div>
	</section>
	<section class="safety-section" id="safe">
		<div class="container safety-layout">
			<div>
				<p class="eyebrow">A QUICK MOMENT OF CARE</p>
				<h2>Look twice at the address.<br />It keeps you safe.</h2>
				<p>
					Scammers love copying familiar names. Before you type a single
					password, make sure you’re on the right website.
				</p>
				<a class="safe-domain" href={PORTAL_URL}>{PORTAL_ADDRESS}</a>
			</div>
			<div class="safety-points">
				<article>
					<span>01</span>
					<div>
						<h3>Check the address letter by letter</h3>
						<p>
							Watch for extra letters or odd endings. A website that borrows the
							logo isn’t necessarily the real one.
						</p>
					</div>
				</article>
				<article>
					<span>02</span>
					<div>
						<h3>Keep your password to yourself</h3>
						<p>
							If someone offers to check your payslip for you and asks for your
							password or a verification code, don’t share it.
						</p>
					</div>
				</article>
				<article>
					<span>03</span>
					<div>
						<h3>Trust that uneasy feeling</h3>
						<p>
							Close any link that seems off and go back to the portal address
							yourself. If you’re unsure, ask your payroll administrator.
						</p>
					</div>
				</article>
			</div>
		</div>
	</section>
	<section class="section container help" id="help">
		<div class="help-intro">
			<p class="eyebrow">QUESTIONS ARE WELCOME</p>
			<h2>GoG e-payslip questions<br />and answers.</h2>
			<p>
				Find help with login, registration, password recovery and checking your
				payslip.
			</p>
			<div class="support-note">
				<h3>Is something wrong with your pay?</h3>
				<p>
					If a deduction surprises you, something is missing, or you have a
					question about your pay, your employer’s payroll administrator is the
					right person to ask.
				</p>
				<p>It helps to have the pay period and a short note of the problem.</p>
			</div>
		</div>
		<div class="faq-list"><DirectAnswers path="/" /></div>
	</section>
	<section class="closing">
		<div class="container">
			<p class="eyebrow">READY WHEN YOU ARE</p>
			<h2>Your payslip is a few clicks away.<br />Then the day is yours.</h2>
			<a class="button yellow" href={PORTAL_URL}>Take me to GoG ePay Services</a
			>
			<p>You’ll continue to {PORTAL_ADDRESS}</p>
		</div>
	</section>
</main>
<Footer />
