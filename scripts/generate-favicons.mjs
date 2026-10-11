import fs from 'node:fs/promises';
import sharp from 'sharp';

const logo = 'static/assets/cagd-logo.png';
for (const [name, size] of [
	['favicon-32.png', 32],
	['favicon-192.png', 192],
	['apple-touch-icon.png', 180],
]) {
	await sharp(logo).resize(size, size, { fit: 'contain', background: '#ffffff' })
		.png().toFile(`static/assets/${name}`);
}

// ICO directory entries containing PNG images are supported by modern browsers.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(size => sharp(logo)
	.resize(size, size, { fit: 'contain', background: '#ffffff' }).png().toBuffer()));
const directory = Buffer.alloc(6 + sizes.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;
for (let i = 0; i < sizes.length; i++) {
	const entry = 6 + i * 16;
	directory[entry] = sizes[i];
	directory[entry + 1] = sizes[i];
	directory.writeUInt16LE(1, entry + 4);
	directory.writeUInt16LE(32, entry + 6);
	directory.writeUInt32LE(images[i].length, entry + 8);
	directory.writeUInt32LE(offset, entry + 12);
	offset += images[i].length;
}
await fs.writeFile('static/favicon.ico', Buffer.concat([directory, ...images]));
