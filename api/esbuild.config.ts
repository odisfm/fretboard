import { build } from 'esbuild'

build({
    entryPoints: ['src/lambda.ts'],
    bundle: true,
    platform: 'node',
    target: 'node20',
    outfile: 'dist/lambda.mjs',
    format: 'esm',
    external: ['sharp'],
    banner: {
        js: [
            `import { createRequire as __lambdaCreateRequire } from 'node:module';`,
            `import { fileURLToPath as __lambdaFileURLToPath } from 'node:url';`,
            `import { dirname as __lambdaDirname } from 'node:path';`,
            `globalThis.require ??= __lambdaCreateRequire(import.meta.url);`,
            `globalThis.__filename ??= __lambdaFileURLToPath(import.meta.url);`,
            `globalThis.__dirname ??= __lambdaDirname(__lambdaFileURLToPath(import.meta.url));`,
        ].join('\n')
    }
})