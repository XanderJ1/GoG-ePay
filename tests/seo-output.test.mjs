import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
const source = await fs.readFile('src/lib/pages.ts', 'utf8');
const compiled = ts.transpileModule(source, {
	compilerOptions: {
		module: ts.ModuleKind.ESNext,
		target: ts.ScriptTarget.ES2022,
	},
}).outputText;
const { pages } = await import(
	'data:text/javascript;base64,' + Buffer.from(compiled).toString('base64')
);
const sitemap = await fs.readFile('build/sitemap.xml', 'utf8');
const production = sitemap.includes('<loc>');
const seenTitles = new Set();
for (const page of pages) {
	test(`${page.path} has complete HTML and consistent metadata`, async () => {
		const html = await fs.readFile('build' + page.path + 'index.html', 'utf8');
		assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
		assert.ok(html.replace(/<[^>]+>/g, '').includes(page.heading));
		assert.ok(
			html.includes(`<title>${page.title.replaceAll('&', '&amp;')}</title>`),
		);
		assert.equal((html.match(/name="description"/g) || []).length, 1);
		assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
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
		assert.ok(
			graph.some(
				(item) => item.url === 'https://www.epayslipgh.com' + page.path,
			),
		);
		for (const section of page.sections)
			assert.ok(html.includes(section.heading));
		if (production)
			assert.ok(
				sitemap.includes(`<loc>https://www.epayslipgh.com${page.path}</loc>`),
			);
		for (const match of html.matchAll(/href="(\/[^"#?]*)(?:[#?][^"]*)?"/g)) {
			const href = match[1];
			if (href.startsWith('/_app/') || href.startsWith('/assets/'))
				await fs.access('build' + href);
			else
				assert.ok(
					pages.some((item) => item.path === href),
					`Broken internal link ${href}`,
				);
		}
	});
}
test('deployment files and social image exist', async () => {
	const robots = await fs.readFile('build/robots.txt', 'utf8');
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
	await fs.access('build/assets/social-card.png');
	const headers = await fs.readFile('build/_headers', 'utf8');
	assert.equal(headers.includes('X-Robots-Tag: noindex'), !production);
	assert.match(await fs.readFile('build/404.html', 'utf8'), /noindex,follow/);
});
