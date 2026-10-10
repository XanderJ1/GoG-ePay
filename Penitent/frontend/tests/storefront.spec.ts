import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
test('clothing journey, persistent bag, and demo checkout', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/shop');
  await expect(
    page.getByRole('heading', { name: 'Everyday, considered.' }),
  ).toBeVisible();
  await page
    .getByRole('link', { name: 'Quiet Hours Tee', exact: true })
    .click();
  await page.getByRole('button', { name: 'M', exact: true }).click();
  await page.getByRole('button', { name: 'Add to bag' }).click();
  await expect(page.getByRole('status')).toContainText('Added to your bag.');
  await page.getByRole('link', { name: 'View bag' }).click();
  await expect(page.getByLabel('Quantity for Quiet Hours Tee')).toHaveValue(
    '1',
  );
  await page.getByLabel('Quantity for Quiet Hours Tee').fill('2');
  await page.getByLabel('Quantity for Quiet Hours Tee').blur();
  await expect(page.locator('.summary')).toContainText('₹4,800');
  await page.reload();
  await expect(page.getByLabel('Quantity for Quiet Hours Tee')).toHaveValue(
    '2',
  );
  await page.getByRole('link', { name: 'Preview checkout' }).click();
  await page.getByLabel('Email', { exact: true }).fill('demo@example.test');
  await page.getByLabel('Mobile number').fill('9876543210');
  await page.getByLabel('Full name', { exact: true }).fill('Demo Visitor');
  await page.getByLabel('Address', { exact: true }).fill('12 Sample Street');
  await page.getByLabel('City', { exact: true }).fill('Bengaluru');
  await page.getByLabel('State', { exact: true }).fill('Karnataka');
  await page.getByLabel('PIN code', { exact: true }).fill('560001');
  await page
    .getByRole('combobox', { name: 'Packaging', exact: true })
    .selectOption('gift');
  await page.getByLabel('Gift message (optional)').fill('A thoughtful demo.');
  await page.getByRole('button', { name: 'Create demo preview' }).click();
  await expect(page.locator('.confirmation')).toContainText(
    'No order has been placed',
  );
  await expect(page.locator('.confirmation')).toContainText('₹4,800');
  await page.goto('/bag');
  await expect(page.getByLabel('Quantity for Quiet Hours Tee')).toHaveValue(
    '2',
  );
  await page.getByRole('button', { name: 'Remove', exact: true }).click();
  await expect(page.getByText('Your bag is waiting')).toBeVisible();
  expect(errors).toEqual([]);
});
test('filters, sold-out selection, and saved pieces', async ({ page }) => {
  await page.goto('/shop');
  await page
    .getByRole('combobox', { name: 'Category', exact: true })
    .selectOption('hoodies');
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(4);
  await page.goto('/products/quiet-hours-tee');
  await expect(
    page.getByRole('button', { name: 'XL — sold out' }),
  ).toBeDisabled();
  await page.getByRole('button', { name: 'Save this piece' }).click();
  await page.goto('/wishlist');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('.product-card')).toHaveCount(1);
});
test('layouts fit the viewport and navigation is usable', async ({
  page,
}, testInfo) => {
  for (const route of [
    '/',
    '/shop',
    '/products/quiet-hours-tee',
    '/bag',
    '/checkout',
    '/story',
    '/collections/becoming',
    '/policies',
  ]) {
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
      route,
    ).toBeTruthy();
  }
  if (testInfo.project.name === 'mobile') {
    await page.goto('/');
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page
      .getByRole('navigation', { name: 'Mobile navigation' })
      .getByRole('link', { name: 'Hoodies' })
      .click();
    await expect(page).toHaveURL(/category=hoodies/);
  }
});
test('protected admin edits product and changes storefront inventory', async ({
  page,
}) => {
  const secrets = process.env.E2E_ADMIN_EMAIL
    ? [
        ['Admin__Email', process.env.E2E_ADMIN_EMAIL],
        ['Admin__Password', process.env.E2E_ADMIN_PASSWORD!],
      ]
    : readFileSync('../backend/Penitent.Api/.env.local', 'utf8')
        .split(/\r?\n/)
        .filter(Boolean)
        .map((line) => line.split(/=(.*)/s).slice(0, 2));
  const credentials = Object.fromEntries(secrets);
  await page.goto('/admin');
  await page
    .getByLabel('Email', { exact: true })
    .fill(credentials.Admin__Email);
  await page
    .getByLabel('Password', { exact: true })
    .fill(credentials.Admin__Password);
  await page.getByRole('button', { name: 'Sign in', exact: false }).click();
  await page.getByRole('button', { name: /Quiet Hours Tee/ }).click();
  await page.getByRole('button', { name: 'Save product' }).click();
  await expect(page.getByRole('status')).toHaveText('Product saved.');
  await page
    .getByRole('combobox', { name: 'Choose variant', exact: true })
    .selectOption({ label: 'PN-01-Ink-S · 8 in stock' });
  await page.getByLabel('Stock', { exact: true }).fill('7');
  await page.getByRole('button', { name: 'Save variant' }).click();
  await expect(page.getByRole('status')).toHaveText(
    'Variant and inventory saved.',
  );
  await page.goto('/products/quiet-hours-tee');
  await page.getByRole('button', { name: 'S', exact: true }).click();
  await expect(page.getByText('7 available')).toBeVisible();
  await page.goto('/admin');
  await page.getByRole('button', { name: /Quiet Hours Tee/ }).click();
  await page
    .getByRole('combobox', { name: 'Choose variant', exact: true })
    .selectOption({ label: 'PN-01-Ink-S · 7 in stock' });
  await page.getByLabel('Stock', { exact: true }).fill('8');
  await page.getByRole('button', { name: 'Save variant' }).click();
  await expect(page.getByRole('status')).toHaveText(
    'Variant and inventory saved.',
  );
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(
    page.getByRole('heading', { name: 'Administrator sign in' }),
  ).toBeVisible();
});
