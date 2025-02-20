import type {BuildOptions} from 'esbuild';

export default {
    format           : 'cjs',
    platform         : 'node',
    target           : 'node22.10',
    outdir           : 'dist/lambda',
    loader           : {'.html': 'text', '.css': 'text', '.ts': 'ts'},
    bundle           : true,
    minifySyntax     : true,
    minifyWhitespace : true,
    minifyIdentifiers: false,
    keepNames        : true,
    sourcemap        : true,
    sourcesContent   : false,
    logLevel         : 'info',
    resolveExtensions: ['.ts', '.tsx', '.js'],
} satisfies BuildOptions;
