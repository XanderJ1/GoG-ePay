import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export async function follow(url, fetcher = fetch) {
	const hops = [];
	const seen = new Set();
	let current = url;
	for (let n = 0; n < 8; n++) {
		if (seen.has(current)) throw new Error('Redirect loop: ' + current);
		seen.add(current);
		const response = await fetcher(current, {
			redirect: 'manual',
			signal: AbortSignal.timeout(20000),
		});
		hops.push({ url: current, status: response.status });
		if (![301, 302, 303, 307, 308].includes(response.status))
			return { response, url: current, hops };
		const location = response.headers.get('location');
		if (!location) throw new Error('Redirect has no Location: ' + current);
		current = new URL(location, current).href;
	}
	throw new Error('Too many redirects: ' + url);
}
export function declaredAssets(html, base) {
	const urls = new Set();
	for (const m of html.matchAll(/<(?:img|script|source|link)\b[^>]*>/g)) {
		const tag = m[0];
		const refs = [...tag.matchAll(/(?:src|href)="([^"]+)"/g)].map((x) => x[1]);
		for (const set of tag.matchAll(/srcset="([^"]+)"/g))
			refs.push(...set[1].split(',').map((x) => x.trim().split(/\s+/)[0]));
		for (const ref of refs) {
			const url = new URL(ref.replaceAll('&amp;', '&'), base);
			if (
				url.origin === new URL(base).origin &&
				!url.pathname.endsWith('/') &&
				!ref.startsWith('data:')
			)
				urls.add(url.href);
		}
	}
	return [...urls];
}
export async function audit(origin, fetcher = fetch) {
	const report = {
		origin,
		checkedAt: new Date().toISOString(),
		pages: [],
		assets: [],
		redirects: [],
		errors: [],
	};
	const error = (m) => report.errors.push(m);
	let sitemap;
	try {
		sitemap = await follow(origin + '/sitemap.xml', fetcher);
	} catch (e) {
		error('Sitemap unavailable: ' + e.message);
		return report;
	}
	if (sitemap.response.status !== 200 || sitemap.hops.length !== 1)
		error('Sitemap must return 200 without redirects');
	const xml = await sitemap.response.text();
	const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
	if (!urls.length) error('Empty sitemap');
	if (new Set(urls).size !== urls.length) error('Duplicate sitemap URLs');
	try {
		const robots = await follow(origin + '/robots.txt', fetcher);
		const robotsText = await robots.response.text();
		if (
			robots.response.status !== 200 ||
			!robotsText.includes('Sitemap: ' + origin + '/sitemap.xml') ||
			/Disallow:\s*\/\s*(?:\n|$)/.test(robotsText)
		)
			error('robots.txt unavailable, blocking or missing sitemap');
	} catch (e) {
		error('robots.txt unavailable: ' + e.message);
	}
	const titles = new Set(),
		descriptions = new Set(),
		assets = new Set();
	for (const url of urls) {
		try {
			if (new URL(url).origin !== origin)
				throw new Error('Sitemap has foreign origin');
			const result = await follow(url, fetcher);
			const html = await result.response.text();
			const canonical = html.match(
				/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/,
			)?.[1];
			const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
			const description = html.match(
				/<meta[^>]*name="description"[^>]*content="([^"]+)"/,
			)?.[1];
			report.pages.push({
				url,
				status: result.response.status,
				hops: result.hops,
				canonical,
				title,
			});
			if (
				result.response.status !== 200 ||
				result.hops.length !== 1 ||
				canonical !== url
			)
				error('Canonical response failure: ' + url);
			if ((html.match(/<h1[\s>]/g) || []).length !== 1)
				error('Expected one H1: ' + url);
			for (const [label, pattern] of [
				['canonical', /<link[^>]*rel="canonical"/g],
				['description', /<meta[^>]*name="description"/g],
				['robots', /<meta[^>]*name="robots"/g],
				['title', /<title>/g],
			]) {
				if ((html.match(pattern) || []).length !== 1)
					error('Expected one ' + label + ': ' + url);
			}
			if (!title || titles.has(title))
				error('Missing or duplicate title: ' + url);
			titles.add(title);
			if (!description || descriptions.has(description))
				error('Missing or duplicate description: ' + url);
			descriptions.add(description);
			if (
				!/name="robots"[^>]*content="index,follow/.test(html) ||
				/noindex/i.test(result.response.headers.get('x-robots-tag') || '')
			)
				error('Indexing blocked: ' + url);
			for (const asset of declaredAssets(html, url)) assets.add(asset);
			if (url !== origin + '/') {
				const alternate = url.replace(/\/$/, '');
				const redirect = await follow(alternate, fetcher);
				report.redirects.push({ url: alternate, hops: redirect.hops });
				if (
					redirect.hops.length !== 2 ||
					redirect.url !== url ||
					![301, 308].includes(redirect.hops[0].status) ||
					redirect.response.status !== 200
				)
					error('Expected one permanent slash redirect: ' + alternate);
			}
		} catch (e) {
			error(url + ': ' + e.message);
		}
	}
	for (const asset of assets) {
		try {
			const result = await follow(asset, fetcher);
			const type = result.response.headers.get('content-type') || '';
			report.assets.push({ url: asset, status: result.response.status, type });
			if (result.response.status !== 200 || type.includes('text/html'))
				error('Missing or wrong asset response: ' + asset);
		} catch (e) {
			error(asset + ': ' + e.message);
		}
	}
	for (const url of [
		'http://' + new URL(origin).host + '/',
		...(new URL(origin).hostname.startsWith('www.')
			? [
					'https://' + new URL(origin).hostname.slice(4) + '/',
					'http://' + new URL(origin).hostname.slice(4) + '/',
				]
			: []),
	]) {
		try {
			const result = await follow(url, fetcher);
			report.redirects.push({ url, hops: result.hops });
			if (result.url !== origin + '/' || result.response.status !== 200)
				error('Origin redirect failed: ' + url);
		} catch (e) {
			error(e.message);
		}
	}
	for (const suffix of [
		'/seo-audit-missing-page/',
		'/assets/seo-audit-missing.png',
	]) {
		try {
			const result = await follow(origin + suffix, fetcher);
			if (result.response.status !== 404) error('Expected real 404: ' + suffix);
		} catch (e) {
			error(e.message);
		}
	}
	return report;
}
if (
	process.argv[1] &&
	path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
	const origin = new URL(process.argv[2] || 'https://www.epayslipgh.com')
		.origin;
	const report = await audit(origin);
	await fs.mkdir('reports', { recursive: true });
	const filename =
		'reports/live-audit-' +
		new Date().toISOString().replaceAll(':', '-') +
		'.json';
	await fs.writeFile(filename, JSON.stringify(report, null, 2) + '\n');
	console.log(
		filename +
			': ' +
			report.pages.length +
			' pages, ' +
			report.assets.length +
			' assets, ' +
			report.errors.length +
			' failures',
	);
	for (const error of report.errors) console.error(error);
	if (report.errors.length) process.exitCode = 1;
}
