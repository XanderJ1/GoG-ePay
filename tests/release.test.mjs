import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
	validateDate,
	validateContent,
	loadContent,
} from '../scripts/content-validation.mjs';
import {
	validateSubmission,
	readOutputSitemap,
} from '../scripts/output-sitemap.mjs';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { follow, declaredAssets, audit } from '../scripts/audit-live.mjs';
test('content registry and answers have valid dates and references', async () => {
	const c = await loadContent();
	validateContent(c.pages, c.answers);
});
test('dates reject future and impossible calendar values', () => {
	for (const d of ['2099-01-01', '2026-02-30', 'today'])
		assert.throws(() => validateDate(d, '2026-10-12'));
});
test('reviewer must have a role and valid date', () => {
	const p = {
		path: '/',
		updatedAt: '2026-10-12',
		sources: [],
		sections: [],
		reviewer: { name: 'Reviewer', role: '', reviewedAt: '2026-10-12' },
	};
	assert.throws(() => validateContent([p], {}));
});
test('IndexNow rejects foreign, unknown, noncanonical and sensitive URLs', () => {
	const o = 'https://www.epayslipgh.com';
	for (const p of [
		'/unknown/',
		'/help',
		'/help/?token=x',
		'//other.example/',
		'/help/#x',
	])
		assert.throws(() => validateSubmission([p], [o + '/help/'], o));
	assert.deepEqual(
		validateSubmission(['/help/', '/help/'], [o + '/help/'], o),
		[o + '/help/'],
	);
});
test('live audit detects loops and broken redirect headers', async () => {
	await assert.rejects(
		follow(
			'https://test/',
			async () => new Response('', { status: 308, headers: { Location: '/' } }),
		),
		/loop/,
	);
	await assert.rejects(
		follow('https://test/', async () => new Response('', { status: 308 })),
		/Location/,
	);
});
test('asset extraction includes responsive image variants and excludes external trackers', () => {
	assert.deepEqual(
		declaredAssets(
			'<source srcset="/a.avif 480w, /b.avif 768w"><script src="https://external.test/tag.js"></script>',
			'https://test/',
		),
		['https://test/a.avif', 'https://test/b.avif'],
	);
});

test('production audit catches wrong canonicals, blocked pages and missing assets', async () => {
	const origin = 'https://www.example.test';
	const fakeFetch = async (url) => {
		if (!url.startsWith(origin))
			return new Response('', {
				status: 308,
				headers: { Location: origin + '/' },
			});
		if (url.endsWith('/sitemap.xml'))
			return new Response(`<urlset><url><loc>${origin}/</loc></url></urlset>`);
		if (url.endsWith('/robots.txt'))
			return new Response(
				`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml`,
			);
		if (url === origin + '/')
			return new Response(
				'<title>Home</title><meta name="description" content="Description"><meta name="robots" content="noindex"><link rel="canonical" href="https://wrong.test/"><h1>Home</h1><img src="/missing.png">',
			);
		return new Response('', { status: 404 });
	};
	const report = await audit(origin, fakeFetch);
	assert.ok(
		report.errors.some((error) => error.includes('Canonical response')),
	);
	assert.ok(report.errors.some((error) => error.includes('Indexing blocked')));
	assert.ok(report.errors.some((error) => error.includes('asset response')));
});

test('sitemap reader supports selected output and rejects a preview sitemap', async () => {
	const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'epayslip-sitemap-'));
	try {
		await fs.writeFile(
			path.join(dir, 'sitemap.xml'),
			'<urlset><url><loc>https://www.epayslipgh.com/</loc></url></urlset>',
		);
		assert.deepEqual((await readOutputSitemap(dir)).urls, [
			'https://www.epayslipgh.com/',
		]);
		await fs.writeFile(path.join(dir, 'sitemap.xml'), '<urlset/>');
		await assert.rejects(readOutputSitemap(dir), /production sitemap/);
	} finally {
		await fs.unlink(path.join(dir, 'sitemap.xml'));
		await fs.rmdir(dir);
	}
});
