import fs from 'node:fs/promises';
export async function readOutputSitemap(explicit = process.env.SEO_OUTPUT_DIR) {
	const dirs = explicit ? [explicit] : ['build', '.vercel/output/static'];
	const found = [];
	for (const dir of dirs) {
		try {
			const file = dir + '/sitemap.xml';
			const stat = await fs.stat(file);
			found.push({ dir, file, time: stat.mtimeMs });
		} catch (e) {
			if (e.code !== 'ENOENT') throw e;
		}
	}
	if (!found.length)
		throw new Error('No generated sitemap. Build first or set SEO_OUTPUT_DIR.');
	found.sort((a, b) => b.time - a.time);
	const chosen = found[0];
	const xml = await fs.readFile(chosen.file, 'utf8');
	const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
	if (!urls.length) throw new Error('Indexable production sitemap required.');
	return { ...chosen, urls };
}
export function validateSubmission(paths, urls, origin) {
	return [
		...new Set(
			paths.map((value) => {
				const url = new URL(value, origin);
				if (
					!value.startsWith('/') ||
					value.startsWith('//') ||
					url.origin !== origin ||
					url.search ||
					url.hash ||
					!urls.includes(url.href)
				)
					throw new Error(
						'Only canonical URLs present in the generated sitemap may be submitted: ' +
							value,
					);
				return url.href;
			}),
		),
	];
}
