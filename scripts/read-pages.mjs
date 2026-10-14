import fs from 'node:fs/promises';
const decode = (text) =>
	text
		.replaceAll('&amp;', '&')
		.replaceAll('&quot;', '"')
		.replaceAll('&#39;', "'")
		.replaceAll('&lt;', '<')
		.replaceAll('&gt;', '>')
		.replace(/\s+/g, ' ')
		.trim();
export async function readPages() {
	const paths = JSON.parse(await fs.readFile('site/pages.json', 'utf8'));
	if (
		!Array.isArray(paths) ||
		new Set(paths).size !== paths.length ||
		!paths.every((path) => /^\/(?:[a-z0-9-]+\/)*$/.test(path))
	)
		throw new Error('Page paths must be unique canonical directory paths.');
	const pages = [],
		answers = {};
	for (const path of paths) {
		const html = await fs.readFile('site' + path + 'index.html', 'utf8');
		const graph = JSON.parse(
			html.match(
				/<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
			)[1],
		)['@graph'];
		const entity = graph.find((item) => item['@id'].endsWith('#page'));
		const sections = [...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g)].map(
			(m) => ({
				heading: decode(m[1].replace(/<[^>]+>/g, '')),
				paragraphs: [],
			}),
		);
		pages.push({
			path,
			title: decode(html.match(/<title>([^<]*)<\/title>/)[1]),
			description: decode(
				html.match(/name="description"\s+content="([^"]+)"/)[1],
			),
			heading: decode(
				html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)[1].replace(/<[^>]+>/g, ''),
			),
			updatedAt: entity.dateModified,
			indexable: true,
			kind:
				path === '/'
					? 'home'
					: entity['@type'] === 'Article'
						? 'guide'
						: 'information',
			sources: (entity.citation || []).map((url) => ({ url, title: url })),
			sections,
			...(entity.reviewedBy
				? {
						reviewer: {
							name: entity.reviewedBy.name,
							role: entity.reviewedBy.jobTitle,
							reviewedAt: entity.lastReviewed,
							profileUrl: entity.reviewedBy.url,
						},
					}
				: {}),
		});
		answers[path] = (entity.mainEntity || []).map((question) => {
			const id = question['@id'].split('#')[1];
			const article =
				html.match(
					new RegExp(`<article[^>]*id="${id}"[^>]*>([\\s\\S]*?)</article>`),
				)?.[1] || '';
			const link = article.match(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
			return {
				id,
				question: question.name,
				answer: question.acceptedAnswer.text,
				guide: link?.[1] || '',
				linkLabel: decode(link?.[2] || ''),
			};
		});
	}
	return { pages, answers };
}
