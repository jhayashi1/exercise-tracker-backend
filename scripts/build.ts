import {build} from 'esbuild';
import config from '../esbuild.config';
import {readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {rm} from 'node:fs/promises';
import JSZip from 'jszip';

const [,, keepOutput] = process.argv;

const __dirname = resolve();
const root = resolve(__dirname);
const fromRoot = (path: string): string => resolve(root, path);

try {
    await rm(fromRoot('dist'), {recursive: true, force: true});

    const endpointNames = readdirSync(fromRoot('src')).filter((name) => name.split('.').length < 2).filter((name) => !name.includes('shared'));
    const endpointDirectories = endpointNames.map((name) => `src/${name}/index.ts`);

    await build({
        ...config,
        entryPoints: endpointDirectories,
    });

    for (const name of endpointNames) {
        const zip = new JSZip();
        const zipPath = join('terraform', `${name}.zip`);
        const dir = endpointNames.length === 1 ? 'dist' : `dist/${name}`;
        const files = readdirSync(fromRoot(dir));

        files.forEach((file) => {
            const path = join(fromRoot(dir), file);
            const fileContent = readFileSync(path);
            zip.file(file, fileContent);
        });

        const zipBuffer = await zip.generateAsync({type: 'nodebuffer'}) ?? '';
        writeFileSync(zipPath, zipBuffer, {flag: 'w'});
    }

    if (!keepOutput) {
        await rm(fromRoot('dist'), {recursive: true, force: true});
    }
} catch (e) {
    console.error(`Error while building lambdas: ${e}`);
}
