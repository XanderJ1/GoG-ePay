import fs from 'node:fs/promises';
import ts from 'typescript';
export async function loadContent() {
	const pageSource = await fs.readFile('src/lib/pages.ts', 'utf8');
	const compile = (s) =>
		ts.transpileModule(s, {
			compilerOptions: {
				module: ts.ModuleKind.ESNext,
				target: ts.ScriptTarget.ES2022,
			},
		}).outputText;
	const pages = (
		await import(
			'data:text/javascript;base64,' +
				Buffer.from(compile(pageSource)).toString('base64')
		)
	).pages;
	const answers = (
		await import(
			'data:text/javascript;base64,' +
				Buffer.from(
					compile(await fs.readFile('src/lib/answers.ts', 'utf8')),
				).toString('base64')
		)
	).answersByPath;
	return { pages, answers };
}
export function validateDate(
	date,
	today = new Date().toISOString().slice(0, 10),
) {
	if (
		!/^\d{4}-\d{2}-\d{2}$/.test(date) ||
		!Number.isFinite(Date.parse(date)) ||
		new Date(date).toISOString().slice(0, 10) !== date ||
		date > today
	)
		throw new Error('Invalid or future content date: ' + date);
}
export function validateContent(pages, answers) {
	const paths = new Set(pages.map((p) => p.path));
	for (const page of pages) {
		validateDate(page.updatedAt);
		if (page.reviewer) {
			const r = page.reviewer;
			if (!r.name?.trim() || !r.role?.trim())
				throw new Error('Reviewer name and role required');
			validateDate(r.reviewedAt);
			if (r.profileUrl && new URL(r.profileUrl).protocol !== 'https:')
				throw new Error('Reviewer profile must use HTTPS');
		}
		for (const source of page.sources) {
			if (!source.title.trim() || new URL(source.url).protocol !== 'https:')
				throw new Error('Invalid source');
			if (source.checkedAt) validateDate(source.checkedAt);
			for (const section of source.supportedSections || [])
				if (!page.sections.some((s) => s.heading === section))
					throw new Error('Source references unknown section');
		}
		const ids = new Set();
		for (const a of answers[page.path] || []) {
			if (
				!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.id) ||
				ids.has(a.id) ||
				!a.linkLabel.trim() ||
				!paths.has(a.guide) ||
				!a.question.trim() ||
				!a.answer.trim()
			)
				throw new Error('Invalid direct answer');
			ids.add(a.id);
			for (const source of a.sources || []) {
				if (!page.sources.some((s) => s.url === source.url))
					throw new Error('Answer source must also appear in page sources');
				if (!source.title.trim() || new URL(source.url).protocol !== 'https:')
					throw new Error('Invalid answer source');
				if (source.checkedAt) validateDate(source.checkedAt);
				for (const section of source.supportedSections || [])
					if (!page.sections.some((s) => s.heading === section))
						throw new Error('Answer source references unknown section');
			}
		}
	}
	for (const path of Object.keys(answers))
		if (!paths.has(path)) throw new Error('Answers reference unknown page');
}
