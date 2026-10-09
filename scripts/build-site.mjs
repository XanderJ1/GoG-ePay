import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
const production = process.argv.includes('--production');
const env = {
	...process.env,
	PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL || 'https://gogepayservices.com',
	PUBLIC_PORTAL_URL: process.env.PUBLIC_PORTAL_URL || 'https://epayslipgh.com/',
	PUBLIC_INDEXING: production ? 'true' : 'false',
};
const result = spawnSync(
	process.execPath,
	['node_modules/vite/bin/vite.js', 'build'],
	{ env, stdio: 'inherit' },
);
if (result.status !== 0) process.exit(result.status || 1);
if (production && process.env.INDEXNOW_KEY) {
	if (!/^[a-zA-Z0-9-]{8,128}$/.test(process.env.INDEXNOW_KEY))
		throw new Error(
			'INDEXNOW_KEY must contain 8–128 letters, digits or hyphens.',
		);
	await fs.writeFile(
		`build/${process.env.INDEXNOW_KEY}.txt`,
		process.env.INDEXNOW_KEY,
	);
}
const previewHeaders = production ? '' : '  X-Robots-Tag: noindex, nofollow\n';
await fs.writeFile(
	'build/_headers',
	`/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Cache-Control: public, max-age=0, must-revalidate\n${previewHeaders}/_app/immutable/*\n  Cache-Control: public, max-age=31536000, immutable\n`,
);
await fs.writeFile(
	'build/_redirects',
	'https://www.gogepayservices.com/* https://gogepayservices.com/:splat 301\nhttp://gogepayservices.com/* https://gogepayservices.com/:splat 301\nhttp://www.gogepayservices.com/* https://gogepayservices.com/:splat 301\n',
);
await fs.writeFile(
	'build/404.html',
	'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>Page not found | GoG ePay Services</title></head><body style="font-family:system-ui;color:#392b24;background:#fbf7f2;padding:10vw;line-height:1.7"><main><h1>Page not found</h1><p>This address does not match a public page.</p><p><a href="/">GoG ePay Services home</a> · <a href="/help/">Find help</a></p></main></body></html>',
);
console.log(
	`Prepared ${production ? 'indexable production' : 'noindex preview'} output in build/.`,
);
