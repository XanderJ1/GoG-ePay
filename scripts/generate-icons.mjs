import fs from 'node:fs/promises';
import sharp from 'sharp';
// Export only the icons we use, avoiding a full icon font or runtime library.
const icons = {
	document: 'receipt',
	chart: 'bar-chart-fill',
	help: 'chat-dots-fill',
	menu: 'list',
	close: 'x-lg',
	arrow: 'arrow-right',
};
await fs.mkdir('static/assets/icons', { recursive: true });
for (const [name, source] of Object.entries(icons)) {
	const svg = await fs.readFile(
		`node_modules/bootstrap-icons/icons/${source}.svg`,
		'utf8',
	);
	await sharp(Buffer.from(svg.replace('fill="currentColor"', 'fill="#007a3d"')))
		.resize(72, 72)
		.png()
		.toFile(`static/assets/icons/${name}.png`);
}
await fs.copyFile(
	'node_modules/bootstrap-icons/LICENSE',
	'static/assets/icons/LICENSE.txt',
);
