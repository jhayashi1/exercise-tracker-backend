import {build} from 'esbuild';
import {readdirSync, createWriteStream, cpSync} from 'fs';
import {join} from 'path';
import archiver from 'archiver';

const endpointNames = readdirSync('src').filter((name) => name.split('.').length < 2);
const endpointDirectories = endpointNames.map((name) => `src/${name}/index.ts`);

build({
    entryPoints: endpointDirectories,
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
}).then(() => {
    endpointNames.forEach((name) => {
        const zipPath = join('dist', `${name}.zip`)
        const output = createWriteStream(zipPath);
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        output.on('close', () => {
            console.log(`completed zipping ${name}`);
            cpSync(zipPath, join('terraform', `${name}.zip`));
        });

        archive.on('error', (err) => {
            throw err;
        });

        archive.pipe(output);
        archive.directory(join('dist', name), false);
        archive.finalize();
    });
}).catch((e) => {
    console.error(e);
    process.exit(1)
});
