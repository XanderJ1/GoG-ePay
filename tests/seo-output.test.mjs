import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { readPages } from '../scripts/read-pages.mjs';
const { pages } = await readPages();
const outputDir = process.env.SEO_OUTPUT_DIR || 'build';
const sitemap = await fs.readFile(outputDir + '/sitemap.xml', 'utf8');
const production = sitemap.includes('<loc>');
const seenTitles = new Set();
for (const page of pages) {
	test(`${page.path} has complete HTML and consistent metadata`, async () => {
		const html = await fs.readFile(
			outputDir + page.path + 'index.html',
			'utf8',
		);
		assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
		assert.ok(
			html
				.replace(/<[^>]+>/g, '')
				.replace(/\s+/g, ' ')
				.includes(page.heading),
		);
		assert.ok(
			html.includes(`<title>${page.title.replaceAll('&', '&amp;')}</title>`),
		);
		assert.equal((html.match(/name="description"/g) || []).length, 1);
		assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
		assert.ok(html.includes('href="/assets/cagd-favicon-192.png"'));
		assert.ok(html.includes('href="/cagd-favicon.ico"'));
		assert.ok(html.includes('/assets/cagd-social-card.png'));
		assert.ok(
			!html.includes('href="/assets/favicon.svg"') &&
				!html.includes('href="/assets/portal-logo.svg"'),
		);
		assert.equal(
			(html.match(/googletagmanager\.com\/gtm\.js/g) || []).length,
			production ? 1 : 0,
		);
		assert.equal(
			(html.match(/googletagmanager\.com\/ns\.html/g) || []).length,
			production ? 1 : 0,
		);
		assert.ok(
			!html.includes('site-tag-head') && !html.includes('site-tag-body'),
		);
		assert.ok(html.includes(`href="https://www.epayslipgh.com${page.path}"`));
		assert.equal(seenTitles.has(page.title), false);
		seenTitles.add(page.title);
		assert.match(html, /https:\/\/gogepayservices.com\//);
		assert.match(
			html,
			production
				? /content="index,follow,max-image-preview:large"/
				: /content="noindex,follow"/,
		);
		const blocks = [
			...html.matchAll(
				/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
			),
		];
		assert.equal(blocks.length, 1);
		const graph = JSON.parse(blocks[0][1])['@graph'];
		const pageEntity = graph.find((item) => item['@id'].endsWith('#page'));
		assert.ok(
			graph.some(
				(item) => item['@id'] === 'https://www.epayslipgh.com/#website',
			),
		);
		assert.equal(
			pageEntity.isPartOf['@id'],
			'https://www.epayslipgh.com/#website',
		);
		assert.equal(pageEntity.dateModified, page.updatedAt);
		for (const citation of pageEntity.citation)
			assert.ok(html.includes(`href="${citation}"`));
		for (const question of pageEntity?.mainEntity || []) {
			assert.ok(html.includes(`id="${question['@id'].split('#')[1]}"`));
			assert.equal(question['@type'], 'Question');
			assert.equal(question.acceptedAnswer['@type'], 'Answer');
			const visibleText = html
				.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
				.replace(/<[^>]*>/g, '')
				.replace(/\s+/g, ' ');
			assert.ok(
				visibleText.includes(question.name),
				'Structured question must be visible',
			);
			assert.ok(
				visibleText.includes(question.acceptedAnswer.text),
				'Structured answer must be visible',
			);
		}
		assert.ok(
			graph.some(
				(item) => item.url === 'https://www.epayslipgh.com' + page.path,
			),
		);
		for (const section of page.sections)
			assert.ok(
				html
					.replace(/<[^>]+>/g, '')
					.replace(/\s+/g, ' ')
					.includes(section.heading),
			);
		if (production)
			assert.ok(
				sitemap.includes(`<loc>https://www.epayslipgh.com${page.path}</loc>`),
			);
		for (const match of html.matchAll(/href="(\/[^"#?]*)(?:[#?][^"]*)?"/g)) {
			const href = match[1];
			if (
				href.startsWith('/_app/') ||
				href.startsWith('/assets/') ||
				href === '/favicon.ico' ||
				href === '/cagd-favicon.ico'
			)
				await fs.access(outputDir + href);
			else
				assert.ok(
					pages.some((item) => item.path === href),
					`Broken internal link ${href}`,
				);
		}
	});
}
test('deployment files and social image exist', async () => {
	const robots = await fs.readFile(outputDir + '/robots.txt', 'utf8');
	assert.match(
		robots,
		production
			? /Allow: \/\nSitemap: https:\/\/www.epayslipgh.com\/sitemap.xml/
			: /Disallow: \//,
	);
	if (production)
		assert.equal(
			(sitemap.match(/<loc>/g) || []).length,
			pages.filter((page) => page.indexable).length,
		);
	await fs.access(outputDir + '/assets/social-card.png');
	const headers = await fs.readFile(outputDir + '/_headers', 'utf8');
	assert.equal(headers.includes('X-Robots-Tag: noindex'), !production);
	assert.match(
		await fs.readFile(outputDir + '/404.html', 'utf8'),
		/noindex,follow/,
	);
	if (outputDir === '.vercel/output/static') {
		const config = JSON.parse(
			await fs.readFile('.vercel/output/config.json', 'utf8'),
		);
		assert.equal(config.version, 3);
		assert.equal(
			config.routes[0].headers['X-Robots-Tag'],
			production ? undefined : 'noindex, nofollow',
		);
		assert.ok(config.routes.some((route) => route.handle === 'filesystem'));
		assert.ok(
			config.routes.some(
				(route) => route.status === 308 && route.headers.Location === '/about/',
			),
		);
		assert.ok(
			config.routes.some(
				(route) =>
					route.src === '^/about/$' && route.dest === '/about/index.html',
			),
		);

		assert.deepEqual(config.routes.at(-1), {
			src: '/.*',
			dest: '/404.html',
			status: 404,
		});
	}
});

test('old asset URLs contain current artwork and favicon fallbacks agree', async () => {
	assert.deepEqual(
		await fs.readFile(outputDir + '/assets/social-card.png'),
		await fs.readFile(outputDir + '/assets/cagd-social-card.png'),
	);
	assert.deepEqual(
		await fs.readFile(outputDir + '/favicon.ico'),
		await fs.readFile(outputDir + '/cagd-favicon.ico'),
	);
	assert.deepEqual(
		await fs.readFile(outputDir + '/assets/favicon-192.png'),
		await fs.readFile(outputDir + '/assets/cagd-favicon-192.png'),
	);
	for (const path of ['assets/favicon.svg', 'assets/portal-logo.svg'])
		await assert.rejects(fs.access(outputDir + '/' + path));
	const redirects = await fs.readFile(outputDir + '/_redirects', 'utf8');
	assert.ok(
		redirects.includes('/assets/favicon.svg /assets/cagd-logo.png 308'),
	);
	if (outputDir === '.vercel/output/static') {
		const config = JSON.parse(
			await fs.readFile('.vercel/output/config.json', 'utf8'),
		);
		for (const path of ['/assets/favicon.svg', '/assets/portal-logo.svg']) {
			const rule = config.routes.find(
				(route) => route.status === 308 && new RegExp(route.src).test(path),
			);
			assert.equal(rule?.headers.Location, '/assets/cagd-logo.png');
		}
	}
});
