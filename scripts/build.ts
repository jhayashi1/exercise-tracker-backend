import {build} from 'esbuild';
import config from '../esbuild.config';
import {readdirSync, createWriteStream, cpSync} from 'node:fs';
import {resolve, join} from 'node:path';
import archiver from 'archiver';

const __dirname = resolve();
const root = resolve(__dirname);
const fromRoot = (path: string): string => resolve(root, path);

try {
    const endpointNames = readdirSync(fromRoot('src')).filter((name) => name.split('.').length < 2);
    const endpointDirectories = endpointNames.map((name) => `src/${name}/index.ts`);

    await build({
        ...config,
        entryPoints: endpointDirectories,
    });

    endpointNames.forEach((name) => {
        const zipPath = join('dist', `${name}.zip`);
        const output = createWriteStream(zipPath);
        const archive = archiver('zip', {
            zlib: {level: 9},
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
} catch (e) {
    console.error(`Error while building lambdas: ${e}`);
}
