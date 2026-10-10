import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('../docs/reference-captures', { recursive: true });
const browser = await chromium.launch();
const notes = [];
for (const [name, url] of [
  ['chanel', 'https://www.chanel.com/in/'],
  ['dior', 'https://www.dior.com/en_in/fashion'],
]) {
  for (const [layout, width, height] of [
    ['desktop', 1440, 1000],
    ['mobile', 375, 812],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } });
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(2500);
      notes.push(name + ' ' + layout + ': ' + (await page.title()));
      await page.screenshot({
        path: '../docs/reference-captures/' + name + '-' + layout + '.png',
      });
    } catch (e) {
      notes.push(name + ' ' + layout + ': unavailable — ' + e.message);
    }
    await page.close();
  }
}
await browser.close();
await writeFile('../docs/reference-captures/status.txt', notes.join('\n'));
