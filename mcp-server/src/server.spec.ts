import type { AddressInfo } from 'node:net';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { startHttpServer } from './http';
import { createNutritionServer } from './server';

type Json = Record<string, any>;

async function connectInMemory(): Promise<Client> {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await createNutritionServer().connect(serverTransport);
  const client = new Client({ name: 'test', version: '1.0.0' });
  await client.connect(clientTransport);
  return client;
}

async function call(client: Client, name: string, args: Json = {}): Promise<Json> {
  const result = (await client.callTool({ name, arguments: args })) as CallToolResult;
  expect(result.isError, JSON.stringify(result.content)).toBeFalsy();
  return result.structuredContent as Json;
}

describe('MCP tools', () => {
  let client: Client;
  beforeAll(async () => {
    client = await connectInMemory();
  });
  afterAll(() => client.close());

  it('exposes read-only tools with instructions', async () => {
    const { tools } = await client.listTools();
    expect(tools.map((t) => t.name).sort()).toEqual([
      'calculate_meal',
      'compare_foods',
      'get_food',
      'list_food_groups',
      'list_nutrients',
      'rank_foods_by_nutrient',
      'search_foods',
    ]);
    expect(tools.every((t) => t.annotations?.readOnlyHint)).toBe(true);
    expect(client.getInstructions()).toContain('100 g');
  });

  it('lists groups and nutrients', async () => {
    const { groups } = await call(client, 'list_food_groups');
    expect(groups.find((g: Json) => g.id === 'QUA').foodCount).toBeGreaterThan(0);
    const { categories } = await call(client, 'list_nutrients', { category: 'mineral' });
    expect(categories).toHaveLength(1);
    expect(categories[0].nutrients.map((n: Json) => n.key)).toContain('calci');
  });

  it('searches foods accent-insensitively', async () => {
    const result = await call(client, 'search_foods', { query: 'trung vit' });
    expect(result.foods.map((f: Json) => f.name)).toContain('Trứng vịt');
    expect(result.foods[0].nutrients).toHaveProperty('kCal');
  });

  it('gets a food by name, scaled to grams', async () => {
    const per100 = await call(client, 'get_food', { food: '9001' });
    const half = await call(client, 'get_food', { food: 'trứng gà', grams: 50, categories: ['general'] });
    const protein = (r: Json) => r.nutrients.find((n: Json) => n.key === 'protein').value;
    expect(half.food.id).toBe('9001');
    expect(protein(half)).toBeCloseTo(protein(per100) / 2, 3);
    expect(half.nutrients.every((n: Json) => n.category === 'general')).toBe(true);
  });

  it('ranks foods by a nutrient given by name', async () => {
    const result = await call(client, 'rank_foods_by_nutrient', { nutrient: 'canxi', limit: 5 });
    expect(result.nutrient.key).toBe('calci');
    expect(result.foods).toHaveLength(5);
    expect(result.foods[0].value).toBeGreaterThanOrEqual(result.foods[4].value);
  });

  it('compares foods', async () => {
    const result = await call(client, 'compare_foods', { foods: ['Cam', 'Bưởi'], nutrients: ['vitaminC'] });
    expect(result.rows).toHaveLength(1);
    expect(result.foods.map((f: Json) => f.id)).toEqual(['5002', '5001']);
    expect(result.rows[0].values).toHaveLength(2);
    expect(result.rows[0].highestFoodId).toBe('5001');
  });

  it('calculates a meal', async () => {
    const result = await call(client, 'calculate_meal', {
      items: [
        { food: '1002', grams: 200 },
        { food: 'rau muống', grams: 150 },
      ],
      nutrients: ['kCal', 'protein'],
    });
    expect(result.totalGrams).toBe(350);
    expect(result.totals.map((t: Json) => t.key)).toEqual(['kCal', 'protein']);
    expect(result.energySplitPercent).not.toBeNull();
  });

  it('returns a readable tool error for unknown input', async () => {
    const result = (await client.callTool({
      name: 'get_food',
      arguments: { food: 'kryptonite' },
    })) as CallToolResult;
    expect(result.isError).toBe(true);
    expect(JSON.stringify(result.content)).toContain('kryptonite');
  });
});

describe('Streamable HTTP transport', () => {
  const httpServer = startHttpServer({ port: 0, host: '127.0.0.1' });
  const baseUrl = () => `http://127.0.0.1:${(httpServer.address() as AddressInfo).port}`;

  beforeAll(async () => {
    if (!httpServer.listening) await new Promise((resolve) => httpServer.once('listening', resolve));
  });
  afterAll(() => new Promise<void>((resolve) => httpServer.close(() => resolve())));

  it('serves a health check', async () => {
    const response = await fetch(`${baseUrl()}/health`);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ status: 'ok', endpoint: '/mcp' });
  });

  it('answers tool calls over HTTP', async () => {
    const client = new Client({ name: 'http-test', version: '1.0.0' });
    await client.connect(new StreamableHTTPClientTransport(new URL(`${baseUrl()}/mcp`)));
    const result = await call(client, 'search_foods', { query: 'salmon' });
    expect(result.foods[0].id).toBe('8011');
    await client.close();
  });

  it('rejects GET on the stateless endpoint', async () => {
    const response = await fetch(`${baseUrl()}/mcp`);
    expect(response.status).toBe(405);
  });
});
