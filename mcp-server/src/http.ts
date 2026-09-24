import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createNutritionServer, SERVER_NAME, SERVER_VERSION } from './server';

export interface HttpOptions {
  port: number;
  host: string;
  /** Endpoint path for the MCP Streamable HTTP transport. */
  path?: string;
}

/**
 * Stateless Streamable HTTP: every POST gets a fresh server + transport, so the process
 * holds no sessions and can scale horizontally or run on any container host.
 */
export function startHttpServer({ port, host, path = '/mcp' }: HttpOptions): Server {
  const httpServer = createServer((req, res) => {
    handle(req, res, path).catch((error) => {
      console.error('MCP request failed:', error);
      if (!res.headersSent) sendJson(res, 500, rpcError(-32603, 'Internal server error'));
    });
  });
  httpServer.listen(port, host, () => {
    console.error(`${SERVER_NAME} MCP server listening on http://${host}:${port}${path}`);
  });
  return httpServer;
}

async function handle(req: IncomingMessage, res: ServerResponse, path: string): Promise<void> {
  // Public, read-only data: allow any origin so browser-based MCP clients can connect.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID',
  );
  res.setHeader('Access-Control-Expose-Headers', 'Mcp-Session-Id');

  const { pathname } = new URL(req.url ?? '/', 'http://localhost');
  if (req.method === 'OPTIONS') {
    res.writeHead(204).end();
    return;
  }
  if (pathname === '/health' || pathname === '/') {
    sendJson(res, 200, { status: 'ok', name: SERVER_NAME, version: SERVER_VERSION, endpoint: path });
    return;
  }
  if (pathname !== path) {
    sendJson(res, 404, { error: 'Not found' });
    return;
  }
  if (req.method !== 'POST') {
    // Stateless mode has no server-initiated stream to resume, so only POST is supported.
    res.setHeader('Allow', 'POST, OPTIONS');
    sendJson(res, 405, rpcError(-32000, 'Method not allowed.'));
    return;
  }

  const server = createNutritionServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  res.on('close', () => {
    void transport.close();
    void server.close();
  });
  await server.connect(transport);
  await transport.handleRequest(req, res);
}

function rpcError(code: number, message: string) {
  return { jsonrpc: '2.0', error: { code, message }, id: null };
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'Content-Type': 'application/json' }).end(JSON.stringify(body));
}
