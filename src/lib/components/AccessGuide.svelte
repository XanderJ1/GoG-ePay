<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { PORTAL_URL, PORTAL_ADDRESS } from '$lib/config';
	import {
		REGISTRATION_VIDEO_URL,
		registrationSteps,
		payslipSteps,
	} from '$lib/tutorial';

	type Mode = 'registration' | 'payslip';
	const modes: Mode[] = ['registration', 'payslip'];
	const stepsFor = (key: Mode) =>
		key === 'registration' ? registrationSteps : payslipSteps;

	let mode = $state<Mode>('registration');
	let active = $state(0);
	let enhanced = $state(false);
	let videoPlaying = $state(false);
	const steps = $derived(stepsFor(mode));

	onMount(() => {
		enhanced = true;
	});

	async function goTo(index: number) {
		active = index;
		await tick();
		document.getElementById(`guide-panel-${mode}-${index}`)?.focus();
	}
	function chooseMode(next: Mode) {
		mode = next;
		active = 0;
	}
	async function handleKey(event: KeyboardEvent, index: number) {
		let next: number;
		switch (event.key) {
			case 'ArrowDown':
			case 'ArrowRight':
				next = (index + 1) % steps.length;
				break;
			case 'ArrowUp':
			case 'ArrowLeft':
				next = (index + steps.length - 1) % steps.length;
				break;
			case 'Home':
				next = 0;
				break;
			case 'End':
				next = steps.length - 1;
				break;
			default:
				return;
		}
		event.preventDefault();
		active = next;
		await tick();
		document.getElementById(`guide-tab-${mode}-${next}`)?.focus();
	}
	const pad = (n: number) => String(n).padStart(2, '0');
</script>

<section class="guide-section" id="guide">
	<div class="container">
		<div class="guide-heading">
			<div>
				<p class="eyebrow">WE’LL TAKE IT ONE STEP AT A TIME</p>
				<h2>Let’s get you set up,<br />then find your payslip.</h2>
			</div>
			<p>
				Brand new to the portal, or just need a refresher?<br />Choose the guide
				that fits.
			</p>
		</div>
		<div
			class="guide-mode"
			hidden={!enhanced}
			role="group"
			aria-label="Choose a tutorial"
		>
			<button
				aria-pressed={mode === 'registration'}
				onclick={() => chooseMode('registration')}>I’m new: register my account</button
			>
			<button
				aria-pressed={mode === 'payslip'}
				onclick={() => chooseMode('payslip')}
				>I have an account: find my payslip</button
			>
		</div>
		<div class="guide-video">
			<div class="guide-video-copy">
				<p class="eyebrow">PREFER TO WATCH?</p>
				<h3>Employee PayServices Registration</h3>
				<p>
					This 2-minute registration tutorial from CAGD shows every screen. Watch
					it first, or follow the written steps below.
				</p>
				<a href={REGISTRATION_VIDEO_URL} target="_blank" rel="noreferrer"
					>Watch on YouTube · 2:02</a
				>
			</div>
			<div class="guide-video-player">
				{#if videoPlaying}
					<iframe
						src="https://www.youtube-nocookie.com/embed/wraUiX0C8wk?autoplay=1"
						title="CAGD Employee PayServices Registration tutorial"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						referrerpolicy="strict-origin-when-cross-origin"
						allowfullscreen
					></iframe>
				{:else}
					<button
						class="video-play"
						aria-label="Play CAGD registration tutorial"
						onclick={() => (videoPlaying = true)}
					>
						<img
							src="/assets/tutorial/sign-in-help.webp"
							alt=""
							width="768"
							height="432"
							loading="lazy"
						/>
						<span
							><svg
								width="28"
								height="28"
								viewBox="0 0 24 24"
								aria-hidden="true"
								><path fill="currentColor" d="m8 5 11 7-11 7z" /></svg
							>Play tutorial</span
						>
					</button>
				{/if}
			</div>
		</div>
		{#each modes as key (key)}
			{#if !enhanced || mode === key}
				{@const list = stepsFor(key)}
				<h3 class="tutorial-heading">
					{key === 'registration'
						? 'Register your account'
						: 'Sign in & find your payslip'}
				</h3>
				<div class="walkthrough" class:enhanced>
					<div
						class="guide-tabs"
						hidden={!enhanced}
						role="tablist"
						aria-orientation="vertical"
						aria-label={key === 'registration'
							? 'Account registration steps'
							: 'Payslip access steps'}
					>
						{#each list as step, i (i)}
							<button
								role="tab"
								id="guide-tab-{key}-{i}"
								aria-selected={active === i}
								aria-controls="guide-panel-{key}-{i}"
								tabindex={active === i ? 0 : -1}
								onclick={() => (active = i)}
								onkeydown={(event) => handleKey(event, i)}
								><span>{pad(i + 1)}</span><span
									>{step.title}<small>{step.subtitle}</small></span
								></button
							>
						{/each}
					</div>
					<div class="guide-panels">
						{#each list as step, i (i)}
							<div
								role="tabpanel"
								id="guide-panel-{key}-{i}"
								aria-label={enhanced ? undefined : step.heading}
								aria-labelledby={enhanced ? `guide-tab-${key}-${i}` : undefined}
								tabindex={enhanced ? 0 : undefined}
								hidden={enhanced && active !== i}
							>
								<p class="step-label">
									STEP {pad(i + 1)} / {list.length}
								</p>
								<h3>{step.heading}</h3>
								<p>{step.description}</p>
								{#if step.image}
									<figure class="tutorial-image">
										<a
											href="/assets/tutorial/{step.image}"
											target="_blank"
											rel="noreferrer"
											aria-label="View larger screenshot: {step.title}"
											><img
												src="/assets/tutorial/{step.image}"
												alt={step.alt}
												width="768"
												height="432"
												loading="lazy"
											/></a
										>
										<figcaption>
											{step.caption}
											<span>Tap the image to enlarge.</span>
										</figcaption>
									</figure>
								{/if}
								<ol class="tutorial-instructions">
									{#each step.instructions as line (line)}
										<li>{line}</li>
									{/each}
								</ol>
								<p class="guide-tip"><b>Good to know</b> {step.tip}</p>
								{#if i === 0}
									<div class="address-box">
										<span>PORTAL ADDRESS</span><strong>{PORTAL_ADDRESS}</strong>
									</div>
									<a href={PORTAL_URL} class="button">Open the portal</a>
								{/if}
								{#if step.videoStart !== undefined}
									<a
										class="chapter-link"
										href="{REGISTRATION_VIDEO_URL}&t={step.videoStart}s"
										target="_blank"
										rel="noreferrer"
										>Watch this step · {Math.floor(
											step.videoStart / 60,
										)}:{pad(step.videoStart % 60)}</a
									>
								{/if}
								{#if enhanced}
									<div class="guide-pagination">
										<button disabled={i === 0} onclick={() => goTo(i - 1)}
											>Previous step</button
										><span>{i + 1} of {list.length}</span><button
											disabled={i === list.length - 1}
											onclick={() => goTo(i + 1)}>Next step</button
										>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	</div>
</section>
