// Run before and after a release against the same host. Reports stay local.
import fs from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
const origin = new URL(process.argv[2] || 'https://www.epayslipgh.com').origin;
const label = process.argv[3] || 'baseline';
if (!/^[a-z0-9-]+$/i.test(label)) throw new Error('Use a simple report label.');
const cli = process.env.LIGHTHOUSE_CLI;
if (!cli)
	throw new Error(
		'Set LIGHTHOUSE_CLI to the Lighthouse CLI entry file (npm exec --package=lighthouse makes it available). Set CHROME_PATH if needed.',
	);
const dir = `reports/lighthouse/${new Date().toISOString().replaceAll(':', '-')}-${label}`;
await fs.mkdir(dir, { recursive: true });
const pages = ['/', '/help/register/', '/help/sign-in/'];
const summary = {
	origin,
	label,
	measuredAt: new Date().toISOString(),
	runs: 3,
	pages: [],
};
for (const pathname of pages) {
	const values = [];
	for (let run = 1; run <= 3; run++) {
		const output = `${dir}/${pathname === '/' ? 'home' : pathname.split('/')[2]}-${run}.json`;
		console.log(`Measuring ${pathname}, mobile run ${run}/3`);
		const result = spawnSync(
			process.execPath,
			[
				cli,
				origin + pathname,
				'--quiet',
				...(process.env.LIGHTHOUSE_PORT
					? [`--port=${process.env.LIGHTHOUSE_PORT}`]
					: []),
				'--chrome-flags=--headless --no-sandbox',
				'--only-categories=performance',
				'--output=json',
				`--output-path=${output}`,
			],
			{ stdio: 'inherit', env: process.env },
		);
		if (result.status !== 0)
			throw new Error('Lighthouse failed; completed reports are preserved.');
		const report = JSON.parse(await fs.readFile(output, 'utf8'));
		if (report.runtimeError) throw new Error(report.runtimeError.message);
		values.push({
			performance: report.categories.performance.score * 100,
			lcpMs: report.audits['largest-contentful-paint'].numericValue,
			cls: report.audits['cumulative-layout-shift'].numericValue,
			tbtMs: report.audits['total-blocking-time'].numericValue,
		});
	}
	const median = (key) => values.map((v) => v[key]).sort((a, b) => a - b)[1];
	summary.pages.push({
		pathname,
		values,
		median: Object.fromEntries(
			Object.keys(values[0]).map((key) => [key, median(key)]),
		),
	});
}
await fs.writeFile(
	`${dir}/summary.json`,
	JSON.stringify(summary, null, 2) + '\n',
);
console.log(`${dir}/summary.json`);
