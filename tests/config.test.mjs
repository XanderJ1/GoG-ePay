import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getConfig, robots, sitemap } from '../scripts/site-config.mjs';
import { readPages } from '../scripts/read-pages.mjs';
async function loadConfig(env) {
	return getConfig(env);
}
test('default destination uses the separate employee application', async () => {
	const config = await loadConfig({});
	assert.equal(config.PORTAL_URL, 'https://gogepayservices.com/');
	assert.equal(config.PORTAL_ADDRESS, 'gogepayservices.com');
	assert.equal(config.SITE_URL, '');
});
test('labels include a configured sign-in path', async () => {
	const config = await loadConfig({
		PUBLIC_PORTAL_URL: 'https://example.com/sign-in',
		PUBLIC_SITE_URL: 'https://example.com',
	});
	assert.equal(config.PORTAL_ADDRESS, 'example.com/sign-in');
	assert.equal(config.SITE_URL, 'https://example.com');
});
test('reject a circular portal destination', async () => {
	await assert.rejects(
		loadConfig({
			PUBLIC_PORTAL_URL: 'https://example.com/',
			PUBLIC_SITE_URL: 'https://example.com',
		}),
		/not this landing page/,
	);
});
test('reject insecure or credential-bearing portal URLs', async () => {
	for (const url of ['http://example.com/', 'https://user:secret@example.com/'])
		await assert.rejects(loadConfig({ PUBLIC_PORTAL_URL: url }));
});
test('reject public site values that would generate incorrect canonical URLs', async () => {
	for (const url of [
		'http://example.com',
		'https://example.com/subdirectory',
		'https://example.com/?tracking=1',
		'https://user:secret@example.com/',
	])
		await assert.rejects(loadConfig({ PUBLIC_SITE_URL: url }));
});

async function loadEndpoint(path, siteUrl) {
	const config = { SITE_URL: siteUrl, INDEXABLE: Boolean(siteUrl) };
	const content = await readPages();
	return {
		GET: () =>
			new Response(
				path === 'robots.txt' ? robots(config) : sitemap(content.pages, config),
			),
	};
}
test('public metadata endpoints use the configured host', async () => {
	const robots = await loadEndpoint(
		'robots.txt',
		'https://landing.example.com',
	);
	assert.match(
		await robots.GET().text(),
		/Allow: \/\nSitemap: https:\/\/landing.example.com\/sitemap.xml/,
	);
	const sitemap = await loadEndpoint(
		'sitemap.xml',
		'https://landing.example.com',
	);
	assert.match(
		await sitemap.GET().text(),
		/<loc>https:\/\/landing.example.com\/<\/loc>/,
	);
});
test('unconfigured previews stay out of search indexes', async () => {
	const robots = await loadEndpoint('robots.txt', '');
	assert.match(await robots.GET().text(), /Disallow: \//);
	const sitemap = await loadEndpoint('sitemap.xml', '');
	assert.doesNotMatch(await sitemap.GET().text(), /<loc>/);
});
test('indexable production requires a public origin', async () => {
	await assert.rejects(
		loadConfig({ PUBLIC_INDEXING: 'true' }),
		/PUBLIC_SITE_URL is required/,
	);
	const config = await loadConfig({
		PUBLIC_SITE_URL: 'https://www.epayslipgh.com',
		PUBLIC_INDEXING: 'true',
	});
	assert.equal(config.INDEXABLE, true);
});
test('analytics requires production indexing, approval and a valid measurement ID', async () => {
	const settings = {
		PUBLIC_SITE_URL: 'https://www.epayslipgh.com',
		PUBLIC_ANALYTICS_ID: 'G-TEST123',
		PUBLIC_ANALYTICS_APPROVED: 'true',
	};
	assert.equal((await loadConfig(settings)).ANALYTICS_ENABLED, false);
	assert.equal(
		(
			await loadConfig({
				...settings,
				PUBLIC_INDEXING: 'true',
				PUBLIC_ANALYTICS_APPROVED: 'false',
			})
		).ANALYTICS_ENABLED,
		false,
	);
	assert.equal(
		(
			await loadConfig({
				...settings,
				PUBLIC_INDEXING: 'true',
				PUBLIC_ANALYTICS_ID: '',
			})
		).ANALYTICS_ENABLED,
		false,
	);
	assert.equal(
		(await loadConfig({ ...settings, PUBLIC_INDEXING: 'true' }))
			.ANALYTICS_ENABLED,
		true,
	);
	await assert.rejects(
		loadConfig({ PUBLIC_ANALYTICS_ID: 'invalid' }),
		/measurement ID/,
	);
});
test('reject copied authentication requests and invalid indexing flags', async () => {
	await assert.rejects(
		loadConfig({ PUBLIC_PORTAL_URL: 'https://auth.example.com/?state=old' }),
		/stable application/,
	);
	await assert.rejects(loadConfig({ PUBLIC_INDEXING: 'yes' }), /true or false/);
});
