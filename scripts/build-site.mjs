import fs from 'node:fs/promises';
import path from 'node:path';
import { loadContent, validateContent } from './content-validation.mjs';
import { getConfig, robots, sitemap } from './site-config.mjs';
import { tagHead, tagBody } from './tracking-tags.mjs';
try {
	process.loadEnvFile('.env');
} catch (error) {
	if (error.code !== 'ENOENT') throw error;
}
const production =
	process.argv.includes('--production') &&
	(!process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production');
const config = getConfig({
	...process.env,
	PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL || 'https://www.epayslipgh.com',
	PUBLIC_PORTAL_URL:
		process.env.PUBLIC_PORTAL_URL || 'https://gogepayservices.com/',
	PUBLIC_INDEXING: production ? 'true' : 'false',
	PUBLIC_ANALYTICS_ID: process.env.PUBLIC_ANALYTICS_ID || 'G-XLNK77DXEZ',
	PUBLIC_ANALYTICS_APPROVED: process.env.PUBLIC_ANALYTICS_APPROVED || 'true',
});
const content = await loadContent();
validateContent(content.pages, content.answers);
const outputDir = process.env.VERCEL ? '.vercel/output/static' : 'build';
const target = path.resolve(outputDir);
// Only remove generated output at these two exact paths inside this checkout.
if (
	![path.resolve('build'), path.resolve('.vercel/output/static')].includes(
		target,
	) ||
	!target.startsWith(process.cwd() + path.sep)
)
	throw new Error('Unsafe output path');
await fs.rm(target, { recursive: true, force: true });
await fs.mkdir(target, { recursive: true });
await fs.cp('site/assets', target + '/assets', { recursive: true });
await fs.copyFile('site/favicon.ico', target + '/favicon.ico');
await fs.copyFile('site/cagd-favicon.ico', target + '/cagd-favicon.ico');
const escape = (value) =>
	value
		.replaceAll('&', '&amp;')
		.replaceAll('"', '&quot;')
		.replaceAll('<', '&lt;');
for (const page of content.pages) {
	let html = await fs.readFile('site' + page.path + 'index.html', 'utf8');
	html = html
		.replaceAll('https://www.epayslipgh.com', config.SITE_URL)
		.replaceAll('https://gogepayservices.com/', escape(config.PORTAL_URL));
	html = html.replace(
		/name="robots"\s+content="[^"]+"/,
		'name="robots" content="' +
			(config.INDEXABLE && page.indexable
				? 'index,follow,max-image-preview:large'
				: 'noindex,follow') +
			'"',
	);
	html = html
		.replace(
			/data-site-url="[^"]*"/,
			'data-site-url="' + escape(config.SITE_URL) + '"',
		)
		.replace(
			/data-portal-url="[^"]*"/,
			'data-portal-url="' + escape(config.PORTAL_URL) + '"',
		)
		.replace(
			/data-analytics-id="[^"]*"/,
			'data-analytics-id="' + config.ANALYTICS_ID + '"',
		)
		.replace(
			/data-analytics-enabled="[^"]*"/,
			'data-analytics-enabled="' + config.ANALYTICS_ENABLED + '"',
		);
	html = html
		.replace('<!-- site-tag-head -->', config.ANALYTICS_ENABLED ? tagHead : '')
		.replace('<!-- site-tag-body -->', config.ANALYTICS_ENABLED ? tagBody : '');
	const dir = target + page.path;
	await fs.mkdir(dir, { recursive: true });
	await fs.writeFile(dir + 'index.html', html);
}
await fs.writeFile(target + '/robots.txt', robots(config));
await fs.writeFile(target + '/sitemap.xml', sitemap(content.pages, config));
await fs.writeFile(
	target + '/404.html',
	'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>Page not found | GoG ePay Services</title><link rel="icon" href="/assets/cagd-favicon-192.png" type="image/png" sizes="192x192"><link rel="stylesheet" href="/assets/site.css"></head><body><main class="container content-page"><h1>Page not found</h1><p>This address does not match a public page.</p><a href="/">Return home</a> · <a href="/help/">Find help</a></main></body></html>',
);
const retiredLogoPaths = [
	'/assets/favicon.svg',
	'/favicon.svg',
	'/assets/portal-logo.svg',
];
const previewHeaders = config.INDEXABLE
	? ''
	: '  X-Robots-Tag: noindex, nofollow\n';
await fs.writeFile(
	target + '/_headers',
	`/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Cache-Control: public, max-age=0, must-revalidate\n${previewHeaders}`,
);
await fs.writeFile(
	target + '/_redirects',
	'https://epayslipgh.com/* https://www.epayslipgh.com/:splat 301\nhttp://www.epayslipgh.com/* https://www.epayslipgh.com/:splat 301\nhttp://epayslipgh.com/* https://www.epayslipgh.com/:splat 301\n' +
		retiredLogoPaths
			.map((path) => `${path} /assets/cagd-logo.png 308`)
			.join('\n') +
		'\n' +
		content.pages
			.filter((p) => p.path !== '/')
			.map((p) => `${p.path.slice(0, -1)} ${p.path} 308`)
			.join('\n') +
		'\n',
);
if (config.INDEXABLE && process.env.INDEXNOW_KEY) {
	if (!/^[a-zA-Z0-9-]{8,128}$/.test(process.env.INDEXNOW_KEY))
		throw new Error('Invalid INDEXNOW_KEY');
	await fs.writeFile(
		target + '/' + process.env.INDEXNOW_KEY + '.txt',
		process.env.INDEXNOW_KEY,
	);
}
if (process.env.VERCEL) {
	const routes = [
		{
			src: '/.*',
			headers: {
				'X-Content-Type-Options': 'nosniff',
				'Referrer-Policy': 'strict-origin-when-cross-origin',
				...(!config.INDEXABLE ? { 'X-Robots-Tag': 'noindex, nofollow' } : {}),
			},
			continue: true,
		},
	];
	routes.push({
		src: '^/(?:favicon\\.ico|cagd-favicon\\.ico|assets/(?:cagd-)?(?:favicon-[0-9]+|apple-touch-icon|social-card)\\.png|assets/cagd-logo\\.png)$',
		headers: { 'Cache-Control': 'public, max-age=0, must-revalidate' },
		continue: true,
	});
	for (const path of retiredLogoPaths)
		routes.push({
			src: '^' + path.replaceAll('.', '\\.') + '$',
			status: 308,
			headers: { Location: '/assets/cagd-logo.png' },
		});
	for (const page of content.pages) {
		if (page.path !== '/')
			routes.push({
				src: '^' + page.path.slice(0, -1) + '$',
				status: 308,
				headers: { Location: page.path },
			});
		routes.push({ src: '^' + page.path + '$', dest: page.path + 'index.html' });
	}
	routes.push(
		{ handle: 'filesystem' },
		{ src: '/.*', dest: '/404.html', status: 404 },
	);
	await fs.writeFile(
		'.vercel/output/config.json',
		JSON.stringify({ version: 3, routes }, null, 2) + '\n',
	);
}
console.log(
	`Prepared ${config.INDEXABLE ? 'indexable production' : 'noindex preview'} plain HTML output in ${outputDir}/.`,
);
