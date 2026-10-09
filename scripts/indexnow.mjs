// Invoke only after the matching production build is successfully deployed.
import fs from 'node:fs/promises';
const key = process.env.INDEXNOW_KEY;
const origin = 'https://gogepayservices.com';
const paths = process.argv.slice(2);
if (!key || !/^[a-zA-Z0-9-]{8,128}$/.test(key) || !paths.length) {
	throw new Error(
		'Set INDEXNOW_KEY and pass changed public paths, for example /help/register/. Deploy the key verification file first.',
	);
}
const sitemap = await fs.readFile('build/sitemap.xml', 'utf8');
if (!sitemap.includes(origin))
	throw new Error('IndexNow requires the deployed indexable production build.');
const urlList = paths.map((value) => {
	const url = new URL(value, origin);
	if (
		url.origin !== origin ||
		url.search ||
		url.hash ||
		!value.startsWith('/') ||
		value.startsWith('//')
	)
		throw new Error(
			'Only canonical public paths on the official site may be submitted.',
		);
	return url.href;
});
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
