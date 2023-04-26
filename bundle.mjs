import { build } from 'esbuild';

try {
    await build({
        entryPoints: ['./src/app.ts'],
        outdir: './dist',
        bundle: true,
        sourcemap: false,
        format: 'cjs',
        platform: 'node',
    });
    console.log('Build completed!');
} catch (err) {
    console.log(err);
}