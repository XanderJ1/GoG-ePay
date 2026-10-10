import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
const vercel = Boolean(process.env.VERCEL);
const outputDir = vercel ? '.vercel/output/static' : 'build';
const production =
	process.argv.includes('--production') &&
	(!process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production');
const env = {
	...process.env,
	PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL || 'https://www.epayslipgh.com',
	PUBLIC_PORTAL_URL:
		process.env.PUBLIC_PORTAL_URL || 'https://gogepayservices.com/',
	PUBLIC_INDEXING: production ? 'true' : 'false',
};
const result = spawnSync(
	process.execPath,
	['node_modules/vite/bin/vite.js', 'build'],
	{ env, stdio: 'inherit' },
);
if (result.status !== 0) process.exit(result.status || 1);
await fs.access(`${outputDir}/index.html`);
if (production && process.env.INDEXNOW_KEY) {
	if (!/^[a-zA-Z0-9-]{8,128}$/.test(process.env.INDEXNOW_KEY))
		throw new Error(
			'INDEXNOW_KEY must contain 8–128 letters, digits or hyphens.',
		);
	await fs.writeFile(
		`${outputDir}/${process.env.INDEXNOW_KEY}.txt`,
		process.env.INDEXNOW_KEY,
	);
}
const previewHeaders = production ? '' : '  X-Robots-Tag: noindex, nofollow\n';
await fs.writeFile(
	`${outputDir}/_headers`,
	`/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Cache-Control: public, max-age=0, must-revalidate\n${previewHeaders}/_app/immutable/*\n  Cache-Control: public, max-age=31536000, immutable\n`,
);
await fs.writeFile(
	`${outputDir}/_redirects`,
	'https://epayslipgh.com/* https://www.epayslipgh.com/:splat 301\nhttp://www.epayslipgh.com/* https://www.epayslipgh.com/:splat 301\nhttp://epayslipgh.com/* https://www.epayslipgh.com/:splat 301\n',
);
await fs.writeFile(
	`${outputDir}/404.html`,
	'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>Page not found | GoG ePay Services</title></head><body style="font-family:system-ui;color:#20382b;background:#f7f9f2;padding:10vw;line-height:1.7"><main><h1>Page not found</h1><p>This address does not match a public page.</p><p><a href="/">GoG ePay Services home</a> · <a href="/help/">Find help</a></p></main></body></html>',
);
if (vercel) {
	const configPath = '.vercel/output/config.json';
	const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
	config.routes = [
		{
			src: '/.*',
			headers: {
				'X-Content-Type-Options': 'nosniff',
				'Referrer-Policy': 'strict-origin-when-cross-origin',
				...(!production ? { 'X-Robots-Tag': 'noindex, nofollow' } : {}),
			},
			continue: true,
		},
		...(config.routes || []),
		{ src: '/.*', dest: '/404.html', status: 404 },
	];
	await fs.writeFile(configPath, JSON.stringify(config, null, 2) + '\n');
}
console.log(
	`Prepared ${production ? 'indexable production' : 'noindex preview'} output in ${outputDir}/.`,
);
