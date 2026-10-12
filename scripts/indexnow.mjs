// Invoke only after the matching production build is successfully deployed.
import { readOutputSitemap, validateSubmission } from './output-sitemap.mjs';
const key = process.env.INDEXNOW_KEY;
const origin = 'https://www.epayslipgh.com';
const paths = process.argv.slice(2);
if (!key || !/^[a-zA-Z0-9-]{8,128}$/.test(key) || !paths.length) {
	throw new Error(
		'Set INDEXNOW_KEY and pass changed public paths, for example /help/register/. Deploy the key verification file first.',
	);
}
const { urls } = await readOutputSitemap();
const urlList = validateSubmission(paths, urls, origin);
const response = await fetch('https://api.indexnow.org/indexnow', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({
		host: new URL(origin).host,
		key,
		keyLocation: `${origin}/${key}.txt`,
		urlList,
	}),
});
if (![200, 202].includes(response.status))
	throw new Error(`IndexNow submission failed: ${response.status}`);
console.log(
	`Submitted ${urlList.length} changed URLs; discovery and indexing remain search-engine decisions.`,
);
