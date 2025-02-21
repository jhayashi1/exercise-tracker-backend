import type {BuildOptions} from 'esbuild';

export default {
    format           : 'cjs',
    platform         : 'node',
    target           : 'node22.10',
    outdir           : 'dist',
    loader           : {'.html': 'text', '.css': 'text'},
    bundle           : true,
    minifySyntax     : true,
    minifyWhitespace : true,
    minifyIdentifiers: false,
    keepNames        : true,
    sourcemap        : true,
    sourcesContent   : false,
    logLevel         : 'info',
} satisfies BuildOptions;
