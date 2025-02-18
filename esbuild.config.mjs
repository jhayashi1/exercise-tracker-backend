import {build} from 'esbuild';
import {execSync} from 'node:child_process';
import 'dotenv/config';

build({
    entryPoints: ['src/index.ts'],
    outdir: 'dist',
    format: 'cjs',
    platform: 'node',
    target: 'node22.12',
    bundle: true,
    minifySyntax: true,
    minifyWhitespace: true,
    minifyIdentifiers: false,
    keepNames: true,
    sourcemap: true,
    sourcesContent: false,
    logLevel: 'info',
}).catch(() => process.exit(1));
