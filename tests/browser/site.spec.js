import { test, expect } from '@playwright/test';
test('vanilla assets load and the tutorial video loads only after Play', async ({
	page,
}) => {
	const failures = [],
		videoRequests = [];
	page.on('response', (response) => {
		if (
			response.url().startsWith('http://127.0.0.1:4173/assets/') &&
			response.status() >= 400
		)
			failures.push(response.url());
	});
	page.on('request', (request) => {
		if (request.url().includes('youtube-nocookie.com'))
			videoRequests.push(request.url());
	});
	await page.route('https://www.youtube-nocookie.com/**', (route) =>
		route.fulfill({
			contentType: 'text/html',
			body: '<!doctype html><title>Tutorial</title>',
		}),
	);
	await page.goto('/');
	await expect(page.locator('script[src="/assets/site.js"]')).toHaveCount(1);
	await expect(page.locator('script[src*="/_app/"]')).toHaveCount(0);
	await page.goto('/help/register/');
	expect(videoRequests).toHaveLength(0);
	await page
		.getByRole('button', { name: 'Play tutorial: CAGD registration' })
		.click();
	await expect(page.locator('#registration-video')).toBeFocused();
	await expect.poll(() => videoRequests.length).toBe(1);
	expect(failures).toEqual([]);
});
test('mobile navigation and compact registration steps', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 720 });
	await page.goto('/help/register/');
	const menu = page.locator('.mobile-menu summary');
	await menu.click();
	await expect(page.locator('.mobile-menu')).toHaveAttribute('open', '');
	await expect(menu).toHaveText('');
	await menu.press('Escape');
	await expect(page.locator('.mobile-menu')).not.toHaveAttribute('open', '');
	await expect(menu).toBeFocused();
	await expect(page.locator('.mobile-step-picker')).toBeVisible();
	await expect(page.locator('.guide-tabs')).toBeHidden();
	await page.locator('.mobile-step-picker select').selectOption('4');
	await expect(page.locator('#guide-panel-registration-4')).toBeFocused();
	await expect(
		page.getByRole('heading', {
			name: 'Verify your phone number.',
			exact: true,
		}),
	).toBeVisible();
	await page.getByRole('button', { name: 'Next step', exact: true }).click();
	await expect(page.locator('#guide-panel-registration-5')).toBeFocused();
	const overflow = await page.evaluate(
		() => document.documentElement.scrollWidth > innerWidth,
	);
	expect(overflow).toBe(false);
});
test('homepage and guides fit mobile and desktop with a single analytics loader', async ({
	page,
}) => {
	const analytics = [];
	await page.route('https://www.googletagmanager.com/gtag/**', (route) =>
		route.fulfill({ contentType: 'application/javascript', body: '' }),
	);
	await page.route('https://www.googletagmanager.com/gtm.js**', (route) =>
		route.fulfill({ contentType: 'application/javascript', body: '' }),
	);
	page.on('request', (request) => {
		if (/google-analytics|googletagmanager\.com\/gtag\//.test(request.url()))
			analytics.push(request.url());
	});
	for (const width of [320, 390, 768, 1440]) {
		await page.setViewportSize({ width, height: 900 });
		for (const path of [
			'/',
			'/help/',
			'/help/register/',
			'/help/sign-in/',
			'/help/reset-password/',
			'/help/view-payslip/',
			'/help/understand-payslip/',
			'/security/',
			'/about/',
			'/contact/',
			'/privacy/',
		]) {
			await page.goto(path);
			expect(
				await page.locator('script[src*="/gtag/js"]').count(),
			).toBeLessThanOrEqual(1);
			expect(await page.locator('.analytics-choice').count()).toBe(0);
			expect(await page.locator('img:not([alt])').count()).toBe(0);
			expect(
				await page.evaluate(
					() => document.documentElement.scrollWidth > innerWidth,
				),
			).toBe(false);
		}
	}
	expect(
		analytics.every((url) => url.includes('/gtag/js?id=G-XLNK77DXEZ')),
	).toBe(true);
	await page.goto('/');
	await page.screenshot({ path: 'reports/seo-home-desktop.png' });
	await page.setViewportSize({ width: 375, height: 812 });
	await page.goto('/help/register/');
	await page.locator('.mobile-step-picker').scrollIntoViewIfNeeded();
	await page.screenshot({ path: 'reports/seo-registration-mobile.png' });
});
test('guide navigation updates metadata and desktop keyboard tabs', async ({
	page,
}) => {
	await page.goto('/help/');
	await page
		.getByRole('heading', {
			name: 'How to log in to your GoG e-payslip',
			exact: true,
		})
		.click();
	await expect(page).toHaveURL(/\/help\/sign-in\/$/);
	await expect(page).toHaveTitle('GoG E-Payslip Login in Ghana | Sign-in Help');
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		'https://www.epayslipgh.com/help/sign-in/',
	);
	await expect(page.locator('.guide-video')).toHaveCount(0);
	await page.locator('#guide-tab-payslip-0').press('End');
	await expect(page.locator('#guide-tab-payslip-3')).toBeFocused();
	await expect(page.locator('#guide-panel-payslip-3')).toBeVisible();
});
test('instructions survive without JavaScript and missing routes return 404', async ({
	browser,
	request,
}) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto('http://127.0.0.1:4173/help/register/');
	await expect(
		page.getByRole('heading', {
			name: 'Verify your phone number.',
			exact: true,
		}),
	).toBeVisible();
	await expect(
		page.getByRole('heading', {
			name: 'Review, register, then sign in.',
			exact: true,
		}),
	).toBeVisible();
	for (const path of [
		'/',
		'/help/',
		'/help/sign-in/',
		'/help/reset-password/',
		'/help/view-payslip/',
		'/help/understand-payslip/',
		'/security/',
		'/about/',
		'/contact/',
		'/privacy/',
	]) {
		await page.goto('http://127.0.0.1:4173' + path);
		await expect(page.locator('h1')).toBeVisible();
		for (const source of await page.locator('.sources a').all())
			await expect(source).toBeVisible();
	}
	await context.close();
	expect((await request.get('/nonexistent/')).status()).toBe(404);
});
test('analytics records one sanitized view per navigation and a portal click', async ({
	page,
}) => {
	await page.route('https://www.googletagmanager.com/**', (route) =>
		route.fulfill({ contentType: 'application/javascript', body: '' }),
	);
	await page.goto('/?employee=private#secret');
	await expect(page.locator('script[src*="/gtag/js"]')).toHaveCount(1);
	await expect(page.locator('script[src*="/gtm.js"]')).toHaveCount(1);
	const events = () =>
		page.evaluate(() =>
			Array.from(window.dataLayer || []).map((item) => Array.from(item)),
		);
	expect(
		(await events()).filter(
			(item) => item[0] === 'event' && item[1] === 'page_view',
		),
	).toHaveLength(1);
	await page.locator('footer a[href="/help/"]').first().click();
	await expect(page).toHaveURL(/\/help\/$/);
	await expect
		.poll(
			async () =>
				(await events()).filter(
					(item) => item[0] === 'event' && item[1] === 'page_view',
				).length,
		)
		.toBe(1);
	await page
		.locator('a[href="https://gogepayservices.com/"]')
		.first()
		.evaluate((element) => {
			element.addEventListener('click', (event) => event.preventDefault());
			element.click();
		});
	const recorded = await events();
	expect(
		recorded.filter(
			(item) => item[0] === 'event' && item[1] === 'portal_login_click',
		),
	).toHaveLength(1);
	expect(JSON.stringify(recorded)).not.toMatch(/employee=|private|secret/);
});
