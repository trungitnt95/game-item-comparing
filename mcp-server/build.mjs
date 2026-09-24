import { build } from 'esbuild';

// Bundles the server, its dependencies, the shared library and the master data into one
// self-contained ES module: `node nutrition-health-mcp.mjs` works without npm install.
await build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/nutrition-health-mcp.mjs',
  bundle: true,
  platform: 'node',
  target: 'node24',
  format: 'esm',
  minify: false,
  legalComments: 'none',
  tsconfig: 'tsconfig.json',
  banner: {
    js: [
      '#!/usr/bin/env node',
      "import { createRequire as __createRequire } from 'node:module';",
      'const require = __createRequire(import.meta.url);',
    ].join('\n'),
  },
  logLevel: 'info',
});
