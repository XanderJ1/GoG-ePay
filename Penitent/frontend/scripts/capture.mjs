import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
await mkdir('../docs/screenshots', { recursive: true });
const browser = await chromium.launch();
for (const [name, width, height] of [
  ['desktop', 1440, 1000],
  ['tablet', 768, 1024],
  ['mobile', 375, 812],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: '../docs/screenshots/home-' + name + '.png',
    fullPage: true,
  });
  await page.goto('http://localhost:5173/products/quiet-hours-tee');
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: '../docs/screenshots/product-' + name + '.png',
    fullPage: true,
  });
  await page.close();
}
await browser.close();
