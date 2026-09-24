import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Node-side tests (shared nutrition library + MCP server). Angular component tests run via `ng test`.
export default defineConfig({
  resolve: {
    alias: {
      '@nutrition/core': fileURLToPath(new URL('./libs/nutrition/src/index.ts', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['libs/**/*.spec.ts', 'mcp-server/src/**/*.spec.ts'],
  },
});
