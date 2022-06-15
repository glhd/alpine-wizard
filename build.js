const fs = require('fs');
const esbuild = require('esbuild');

function build(options = {}) {
	options.define || (options.define = {});
	options.define['process.env.NODE_ENV'] = process.argv.includes('--watch')
		? `'production'`
		: `'development'`;
	
	return esbuild
		.build({
			watch: process.argv.includes('--watch'),
			...options,
		})
		.catch((e) => {
			console.error(e);
			process.exit(1);
		});
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
});

// ESM
build({
	entryPoints: ['builds/esm.js'],
	outfile: `dist/wizard.esm.js`,
	bundle: true,
	platform: 'neutral',
	external: ['validatorjs'],
	mainFields: ['module', 'main'],
});

// CommonJS
build({
	entryPoints: ['builds/esm.js'],
	outfile: `dist/wizard.cjs.js`,
	bundle: true,
	target: ['node10.4'],
	platform: 'node',
	external: ['validatorjs'],
});
