import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { startHttpServer } from './http';
import { createNutritionServer } from './server';

// stdout carries the stdio protocol, so all logging goes to stderr.
const useHttp = process.argv.includes('--http') || process.env['MCP_TRANSPORT'] === 'http';

if (useHttp) {
  startHttpServer({
    port: Number(process.env['PORT'] ?? 3000),
    host: process.env['HOST'] ?? '127.0.0.1',
    path: process.env['MCP_PATH'] ?? '/mcp',
  });
} else {
  await createNutritionServer().connect(new StdioServerTransport());
}
