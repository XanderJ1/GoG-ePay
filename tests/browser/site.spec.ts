import { test, expect } from '@playwright/test';
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
test('homepage and guides fit mobile and desktop without loading analytics', async ({
	page,
}) => {
	const analytics: string[] = [];
	page.on('request', (request) => {
		if (/google-analytics|googletagmanager/.test(request.url()))
			analytics.push(request.url());
	});
	for (const width of [320, 768, 1440]) {
		await page.setViewportSize({ width, height: 900 });
		for (const path of ['/', '/help/', '/help/register/', '/security/']) {
			await page.goto(path);
			expect(
				await page.evaluate(
					() => document.documentElement.scrollWidth > innerWidth,
				),
			).toBe(false);
		}
	}
	expect(analytics).toEqual([]);
	await page.goto('/');
	await page.screenshot({ path: 'previews/seo-home-desktop.png' });
	await page.setViewportSize({ width: 375, height: 812 });
	await page.goto('/help/register/');
	await page.locator('.mobile-step-picker').scrollIntoViewIfNeeded();
	await page.screenshot({ path: 'previews/seo-registration-mobile.png' });
});
test('guide navigation updates metadata and desktop keyboard tabs', async ({
	page,
}) => {
	await page.goto('/help/');
	await page
		.getByRole('heading', {
			name: 'How to sign in to your GoG e-payslip',
			exact: true,
		})
		.click();
	await expect(page).toHaveURL(/\/help\/sign-in\/$/);
	await expect(page).toHaveTitle(
		'GoG E-Payslip Login Help | Official Employee Access',
	);
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
	await context.close();
	expect((await request.get('/nonexistent/')).status()).toBe(404);
});
