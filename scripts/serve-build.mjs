import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(process.env.SEO_OUTPUT_DIR || 'build');
const port = Number(process.env.PORT || 4173);
const types = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css',
	'.js': 'text/javascript',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.ico': 'image/x-icon',
	'.webp': 'image/webp',
	'.avif': 'image/avif',
	'.xml': 'application/xml',
	'.txt': 'text/plain',
	'.json': 'application/json',
};
http
	.createServer(async (req, res) => {
		try {
			const pathname = decodeURIComponent(
				new URL(req.url, 'http://localhost').pathname,
			);
			const target = path.resolve(root, '.' + pathname);
			if (target !== root && !target.startsWith(root + path.sep)) {
				res.writeHead(403).end();
				return;
			}
			let file = target;
			try {
				const stat = await fs.stat(file);
				if (stat.isDirectory()) {
					if (!pathname.endsWith('/')) {
						res.writeHead(301, { Location: pathname + '/' }).end();
						return;
					}
					file = path.join(file, 'index.html');
				}
				const data = await fs.readFile(file);
				res
					.writeHead(200, {
						'Content-Type':
							types[path.extname(file)] || 'application/octet-stream',
					})
					.end(data);
			} catch {
				res
					.writeHead(404, { 'Content-Type': 'text/html' })
					.end(await fs.readFile(path.join(root, '404.html')));
			}
		} catch {
			res.writeHead(400).end();
		}
	})
	.listen(port, '127.0.0.1', () =>
		console.log(`Built site: http://127.0.0.1:${port}`),
	);
