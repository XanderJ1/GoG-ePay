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
				No queues, no chasing anyone down. Sign in to the portal and see your
				electronic payslip in a few quiet minutes.
			</p>
			<div class="actions">
				<a class="button" href={PORTAL_URL}>Go to my payslip</a><a
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
			<h2>Let’s sort it<br />out together.</h2>
			<p>Short, honest answers to what people ask us most.</p>
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
		<div class="faq-list">
			<details open>
				<summary>Where can I see my payslip?</summary>
				<p>
					Use any login button on this page to reach <a href={PORTAL_URL}
						>{PORTAL_ADDRESS}</a
					>. Sign in to your employee account and follow the payslip options
					there.
				</p>
			</details>
			<details>
				<summary>Can I sign in on this page?</summary>
				<p>
					No. This page is only a guide. You’ll enter your login details on the
					portal itself, after you select “Log in to portal”.
				</p>
			</details>
			<details>
				<summary>I forgot my password. What now?</summary>
				<p>
					Select “Forgot password?” on the portal’s sign-in page. If you still
					can’t get back in, ask your payroll administrator what to do next.
				</p>
			</details>
			<details>
				<summary>I’m new. How do I get access?</summary>
				<p>
					Follow the <a href="/help/register/">registration tutorial</a>. You’ll
					verify your employee number and Ghana Card, confirm your phone number
					and set up your password. If any greyed-out profile details are wrong,
					ask your HR department to correct them.
				</p>
			</details>
			<details>
				<summary>My payslip is missing, or something looks off.</summary>
				<p>
					First, double-check the pay period. If it still looks wrong, contact
					your payroll administrator and tell them the period and exactly what
					you’d like clarified.
				</p>
			</details>
			<details>
				<summary>Is it okay to use a shared computer?</summary>
				<p>
					Yes, with care. Don’t save your password, sign out when you’re done,
					and delete any payslip you downloaded before you leave.
				</p>
			</details>
			<details>
				<summary>Someone sent me a payslip link. Should I click it?</summary>
				<p>
					Better not to. Type {PORTAL_ADDRESS} into your browser yourself instead.
					And never send your password or verification code to anyone.
				</p>
			</details>
		</div>
	</section>
	<div class="container"><DirectAnswers path="/" /></div>
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
