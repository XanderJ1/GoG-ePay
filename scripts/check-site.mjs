import fs from 'node:fs/promises';
import { loadContent, validateContent } from './content-validation.mjs';
import { spawnSync } from 'node:child_process';
const content = await loadContent();
validateContent(content.pages, content.answers);
for (const page of content.pages) {
	const html = await fs.readFile('site' + page.path + 'index.html', 'utf8');
	if ((html.match(/<h1[\s>]/g) || []).length !== 1)
		throw new Error('Expected one H1: ' + page.path);
	if (/svelte|\/_app\/|modulepreload/.test(html))
		throw new Error('Framework artifact: ' + page.path);
}
for (const file of [
	'site/assets/site.js',
	...(await fs.readdir('scripts'))
		.filter((file) => file.endsWith('.mjs'))
		.map((file) => 'scripts/' + file),
]) {
	if (
		spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' })
			.status !== 0
	)
		throw new Error('Invalid JavaScript: ' + file);
}
console.log(`Validated ${content.pages.length} plain HTML pages.`);
