import { spawn, spawnSync } from 'node:child_process';
import { watch } from 'node:fs';
const build = () =>
	spawnSync(process.execPath, ['scripts/build-site.mjs'], { stdio: 'inherit' })
		.status === 0;
if (!build()) process.exit(1);
const server = spawn(process.execPath, ['scripts/serve-build.mjs'], {
	stdio: 'inherit',
	env: { ...process.env, PORT: process.env.PORT || '5173' },
});
let timer;
const watcher = watch('site', { recursive: true }, () => {
	clearTimeout(timer);
	timer = setTimeout(build, 250);
});
function stop() {
	watcher.close();
	clearTimeout(timer);
	server.kill();
}
process.on('SIGINT', () => {
	stop();
	process.exit();
});
process.on('SIGTERM', () => {
	stop();
	process.exit();
});
server.on('exit', (code) => {
	watcher.close();
	process.exitCode = code || 0;
});
