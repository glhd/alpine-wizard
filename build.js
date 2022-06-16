const esbuild = require('esbuild');
const { file: brotliSizeFromFile } = require('brotli-size');

const watching = process.argv.includes('--watch');

function build(options = {}) {
	options.define || (options.define = {});
	options.define['process.env.NODE_ENV'] = watching
		? `'development'`
		: `'production'`;
	
	return esbuild
		.build({
			watch: watching
				? {
					onRebuild(err, result) {
						if (err) {
							console.error(err);
						} else {
							console.log(`✅ Rebuilt ${ options.outfile }`);
						}
					}
				}
				: false,
			...options,
		})
		.then(result => ({ result, options }))
		.catch((e) => {
			console.error(e);
			process.exit(1);
		});
}

function bytesToSize(bytes) {
	const units = [`byte`, `kilobyte`, `megabyte`];
	const unit = Math.floor(Math.log(bytes) / Math.log(1024));
	return new Intl.NumberFormat("en", { style: "unit", unit: units[unit] }).format(bytes / 1024 ** unit);
}

// CDN
build({
	entryPoints: ['builds/cdn.js'],
	outfile: `dist/wizard.cdn.js`,
	bundle: true,
	platform: 'browser',
	define: { CDN: true },
});

// CDN — minified
build({
	entryPoints: ['builds/cdn.js'],
	outfile: `dist/wizard.cdn.min.js`,
	bundle: true,
	minify: true,
	platform: 'browser',
	define: { CDN: true },
}).then(async ({ options }) => {
	const { gzipSizeFromFile } = await import('gzip-size');
	const gzipped = bytesToSize(await gzipSizeFromFile(options.outfile));
	const brotli = bytesToSize(await brotliSizeFromFile(options.outfile));
	console.log(`✅ ${ options.outfile }: ${ gzipped } gzipped, ${ brotli } brotli`);
});

// ESM
build({
	entryPoints: ['builds/esm.js'],
	outfile: `dist/wizard.esm.js`,
	bundle: true,
	platform: 'neutral',
	external: ['validatorjs'],
	mainFields: ['module', 'main'],
}).then(async ({ options }) => {
	console.log(`✅ ${ options.outfile }`);
});

// CommonJS
build({
	entryPoints: ['builds/esm.js'],
	outfile: `dist/wizard.cjs.js`,
	bundle: true,
	target: ['node10.4'],
	platform: 'node',
	external: ['validatorjs'],
}).then(async ({ options }) => {
	console.log(`✅ ${ options.outfile }`);
});

if (watching) {
	console.log(`\nWatching project…\n`);
}
