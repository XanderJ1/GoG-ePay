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
	import { slide } from 'svelte/transition';

	const guideCards = [
		{ path: '/help/register/', num: '01' },
		{ path: '/help/sign-in/', num: '02' },
		{ path: '/help/reset-password/', num: '03' },
		{ path: '/help/view-payslip/', num: '04' },
		{ path: '/help/understand-payslip/', num: '05' }
	];

	let openGuideIndex = $state<number | null>(1);
</script>

<SEO page={pages[0]} />

<Header theme="dark" />
<main id="main" tabindex="-1">
	<div class="clinika-hero-wrap">
		<section class="hero clinika-hero">
			<div class="hero-copy">
				<h1 class="hero-headline">Official Government of Ghana <em>E-Payslip Services</em></h1>
				<p class="intro">
					No queues, no chasing anyone down. Sign in to the portal and see your
					electronic payslip in a few quiet minutes.
				</p>
				<div class="actions">
					<a class="button clinika-btn-primary" href={PORTAL_URL}>
						Go to my payslip <span class="arrow-circle" aria-hidden="true">→</span>
					</a>
					<a class="button clinika-btn-secondary" href="#guide">
						First time? Start here
					</a>
				</div>
			</div>

			<div class="hero-visual">
				<!-- Concentric decorative aura rings matching the Clinika reference -->
				<svg class="concentric-rings" viewBox="0 0 500 500" fill="none" aria-hidden="true">
					<circle cx="250" cy="250" r="130" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
					<circle cx="250" cy="250" r="190" stroke="rgba(255,255,255,0.10)" stroke-width="1" stroke-dasharray="4 6" />
					<circle cx="250" cy="250" r="250" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
					<circle cx="384" cy="116" r="4" fill="var(--accent)" />
				</svg>

				<div class="hero-portrait">
					<enhanced:img
						src={employeeImage}
						alt="A professional checking her phone at a courtyard desk"
						sizes="(max-width: 760px) 100vw, 50vw"
						fetchpriority="high"
					/>
				</div>
			</div>
		</section>

		<!-- Bottom Horizontal Strip: 5 equal columns with hairline dividers matching the reference image -->
		<div class="clinika-strip-wrap">
			<div class="container clinika-strip-grid">
				<a href={PORTAL_URL} class="strip-item">
					<span class="strip-num">01</span>
					<span class="strip-text">Open my payslip</span>
				</a>
				<a href="#guide" class="strip-item">
					<span class="strip-num">02</span>
					<span class="strip-text">Help me sign in</span>
				</a>
				<a href="#understand" class="strip-item">
					<span class="strip-num">03</span>
					<span class="strip-text">Understand pay</span>
				</a>
				<a href="#safe" class="strip-item">
					<span class="strip-num">04</span>
					<span class="strip-text">Account safety</span>
				</a>
				<a href="#help" class="strip-item">
					<span class="strip-num">05</span>
					<span class="strip-text">I have a question</span>
				</a>
			</div>
		</div>
	</div>

	<section class="section container services" id="services">
		<div class="section-heading services-heading">
			<h2>Start here.<br />Understand your pay with <em>confidence.</em></h2>
			<p>
				This page is your friendly starting point. Read a little, ask your
				questions, then head to your account on the portal when you're ready.
			</p>
		</div>
		<div class="service-grid">
			<article class="service-card card-pastel-blue">
				<div class="card-header">
					<h3>See your payslip</h3>
					<a href={PORTAL_URL} class="card-arrow" aria-label="Take me to the portal">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
							<line x1="7" y1="17" x2="17" y2="7"></line>
							<polyline points="7 7 17 7 17 17"></polyline>
						</svg>
					</a>
				</div>
				<p>
					Sign in to your employee account to view the payslip information
					available to you.
				</p>
				<div class="card-footer">
					<a href={PORTAL_URL} class="service-link">
						Take me to the portal <span class="arrow-icon" aria-hidden="true">→</span>
					</a>
				</div>
			</article>

			<article class="service-card card-pastel-yellow">
				<div class="card-header">
					<h3>Make sense of the numbers</h3>
					<a href="#understand" class="card-arrow" aria-label="Explain it simply">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
							<line x1="7" y1="17" x2="17" y2="7"></line>
							<polyline points="7 7 17 7 17 17"></polyline>
						</svg>
					</a>
				</div>
				<p>
					Earnings, deductions, net pay. A short, jargon-free explanation before
					you look at your own figures.
				</p>
				<div class="card-footer">
					<a href="#understand" class="service-link">
						Explain it simply <span class="arrow-icon" aria-hidden="true">→</span>
					</a>
				</div>
			</article>

			<article class="service-card card-pastel-pink">
				<div class="card-header">
					<h3>Get a hand when you're stuck</h3>
					<a href="#help" class="card-arrow" aria-label="Find an answer">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
							<line x1="7" y1="17" x2="17" y2="7"></line>
							<polyline points="7 7 17 7 17 17"></polyline>
						</svg>
					</a>
				</div>
				<p>
					Trouble signing in? Not sure who to ask? You'll find straight answers
					and next steps here.
				</p>
				<div class="card-footer">
					<a href="#help" class="service-link">
						Find an answer <span class="arrow-icon" aria-hidden="true">→</span>
					</a>
				</div>
			</article>
		</div>
	</section>

	<section class="section container guide-container" id="guide">
		<div class="guide-header">
			<h2>Get set up. Find your payslip <em>step by step.</em></h2>
			<p>Follow the CAGD registration tutorial or choose the help you need.</p>
		</div>

		<div class="guide-layout">
			<!-- Left Column: Thinner card for Know the official addresses -->
			<div class="guide-aside-wrap">
				<OfficialDomains />
			</div>

			<!-- Right Column: Get set up accordion list -->
			<div class="guide-accordion-wrap">
				<div class="guide-accordion">
					{#each guideCards as item, idx}
						{@const guide = pageFor(item.path)}
						{#if guide}
							<div class="guide-accordion-item" class:is-open={openGuideIndex === idx}>
								<button
									type="button"
									class="guide-accordion-trigger"
									onclick={() => openGuideIndex = openGuideIndex === idx ? null : idx}
									aria-expanded={openGuideIndex === idx}
								>
									<span class="guide-accordion-title">{guide.heading}</span>
									<span class="guide-accordion-icon" aria-hidden="true">
										{#if openGuideIndex === idx}
											<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
												<line x1="18" y1="6" x2="6" y2="18"></line>
												<line x1="6" y1="6" x2="18" y2="18"></line>
											</svg>
										{:else}
											<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
												<line x1="12" y1="5" x2="12" y2="19"></line>
												<line x1="5" y1="12" x2="19" y2="12"></line>
											</svg>
										{/if}
									</span>
								</button>
								{#if openGuideIndex === idx}
									<div class="guide-accordion-body" transition:slide={{ duration: 260 }}>
										<p>{guide.description}</p>
										<a class="guide-item-link" href={guide.path}>
											Read step-by-step guide <span class="arrow-icon" aria-hidden="true">→</span>
										</a>
									</div>
								{/if}
							</div>
						{/if}
					{/each}
				</div>
				<p class="guides-footer-link">
					<a class="text-link" href="/help/">See all help & guides <span class="arrow-icon" aria-hidden="true">→</span></a>
				</p>
			</div>
		</div>
	</section>

	<section class="section container understand-wrapper" id="understand">
		<div class="understand-panel">
			<div class="understand-intro">
				<div class="eyebrow-badge">
					<span class="badge-dot" aria-hidden="true"></span>
					<p class="eyebrow">NO ACCOUNTING DEGREE NEEDED</p>
				</div>
				<h2>Reading your payslip,<br />made <em>easy.</em></h2>
				<p class="body-large">
					Every payslip tells the same simple story. Here are the three words
					you’ll see most.
				</p>
				<p class="fine">
					This is a general guide. Your own payslip may use different labels or
					show extra items.
				</p>
				<div class="pay-equation">
					<span class="eq-term">Gross pay</span>
					<span class="eq-op">−</span>
					<span class="eq-term">Deductions</span>
					<span class="eq-op">=</span>
					<span class="eq-term eq-highlight">Net pay</span>
				</div>
			</div>
			<div class="pay-terms">
				<article class="pay-term-card">
					<span class="term-num">01</span>
					<div class="term-content">
						<h3>Gross pay</h3>
						<p>
							What you’ve earned before anything is taken out. Depending on your
							payslip, this may include your basic pay and any allowances.
						</p>
					</div>
				</article>
				<article class="pay-term-card">
					<span class="term-num">02</span>
					<div class="term-content">
						<h3>Deductions</h3>
						<p>
							Money taken from your earnings, like taxes, pension contributions or
							other items listed on your payslip.
						</p>
					</div>
				</article>
				<article class="pay-term-card">
					<span class="term-num">03</span>
					<div class="term-content">
						<h3>Net pay</h3>
						<p>
							What’s left after deductions. Check it against the other figures for
							the same pay period.
						</p>
					</div>
				</article>
			</div>
		</div>
	</section>

	<section class="safety-section" id="safe">
		<div class="container safety-layout">
			<div class="safety-intro">
				<div class="eyebrow-badge dark">
					<span class="badge-dot accent" aria-hidden="true"></span>
					<p class="eyebrow">A QUICK MOMENT OF CARE</p>
				</div>
				<h2>Look twice at the address.<br />It keeps you <em>safe.</em></h2>
				<p>
					Scammers love copying familiar names. Before you type a single
					password, make sure you’re on the right website.
				</p>
				<div class="safe-domain-badge">
					<span class="domain-icon" aria-hidden="true">🔒</span>
					<a class="safe-domain" href={PORTAL_URL}>{PORTAL_ADDRESS}</a>
					<span class="domain-tag">VERIFIED CAGD URL</span>
				</div>
			</div>
			<div class="safety-points">
				<article class="safety-card">
					<span class="safety-num">01</span>
					<div class="safety-content">
						<h3>Check the address letter by letter</h3>
						<p>
							Watch for extra letters or odd endings. A website that borrows the
							logo isn’t necessarily the real one.
						</p>
					</div>
				</article>
				<article class="safety-card">
					<span class="safety-num">02</span>
					<div class="safety-content">
						<h3>Keep your password to yourself</h3>
						<p>
							If someone offers to check your payslip for you and asks for your
							password or a verification code, don’t share it.
						</p>
					</div>
				</article>
				<article class="safety-card">
					<span class="safety-num">03</span>
					<div class="safety-content">
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
			<div class="eyebrow-badge">
				<span class="badge-dot" aria-hidden="true"></span>
				<p class="eyebrow">QUESTIONS ARE WELCOME</p>
			</div>
			<h2>Let’s sort it<br />out <em>together.</em></h2>
			<p>Short, honest answers to what people ask us most.</p>
			<div class="support-note">
				<div class="support-note-header">
					<span class="support-icon" aria-hidden="true">💡</span>
					<h3>Is something wrong with your pay?</h3>
				</div>
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

	<div class="container"><DirectAnswers path="/" /></div>

	<section class="closing">
		<div class="container closing-content">
			<div class="eyebrow-badge dark">
				<span class="badge-dot accent" aria-hidden="true"></span>
				<p class="eyebrow">READY WHEN YOU ARE</p>
			</div>
			<h2>Your payslip is a few clicks away.<br /><em>Then the day is yours.</em></h2>
			<a class="button yellow" href={PORTAL_URL}>Take me to GoG ePay Services <span class="arrow-icon" aria-hidden="true">→</span></a>
			<p class="closing-sub">
				<span class="lock-icon" aria-hidden="true">🔒</span>
				You’ll continue to <strong>{PORTAL_ADDRESS}</strong>
			</p>
		</div>
	</section>
</main>
<Footer />
