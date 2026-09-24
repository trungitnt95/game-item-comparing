import {
  DATA_SOURCE,
  nutritionCatalog,
  SUMMARY_NUTRIENT_KEYS,
  type Food,
  type Nutrient,
  type NutritionCatalog,
} from '@nutrition/core';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

export const SERVER_NAME = 'nutrition-health';
export const SERVER_VERSION = '1.0.0';

/** Nutrients compared when the caller does not pick any. */
const DEFAULT_COMPARE_KEYS = [
  ...SUMMARY_NUTRIENT_KEYS,
  'sugar',
  'calci',
  'sat',
  'kali',
  'natri',
  'vitaminA',
  'vitaminC',
  'cholesterol',
];

const READ_ONLY = { readOnlyHint: true, idempotentHint: true, openWorldHint: false } as const;

const INSTRUCTIONS = `Dữ liệu dinh dưỡng thực phẩm Việt Nam, nguồn: ${DATA_SOURCE.name} – ${DATA_SOURCE.publisher}.
- Mọi giá trị gốc tính trên 100 g phần ăn được; các tool nhận "grams" sẽ tự quy đổi.
- value = null nghĩa là bảng gốc KHÔNG có số liệu (không phải bằng 0).
- Thực phẩm có thể truyền bằng id (vd "5040") hoặc tên tiếng Việt/Anh (có dấu hoặc không dấu).
- Chất dinh dưỡng có thể truyền bằng key (vd "vitaminC") hoặc tên ("vitamin C", "canxi", "iron"). Gọi list_nutrients để xem đủ danh sách.
- Dữ liệu chỉ để tham khảo, không thay thế tư vấn của bác sĩ hoặc chuyên gia dinh dưỡng.`;

export function createNutritionServer(catalog: NutritionCatalog = nutritionCatalog): McpServer {
  const server = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { instructions: INSTRUCTIONS },
  );
  const groupIds = catalog.groups.map((g) => g.id) as [string, ...string[]];
  const categoryIds = catalog.categories.map((c) => c.id) as [string, ...string[]];

  const foodRef = (food: Food) => ({
    id: food.id,
    name: food.name,
    nameEnglish: food.nameEnglish,
    group: food.group,
  });
  const nutrientRef = (nutrient: Nutrient) => ({
    key: nutrient.key,
    name: nutrient.name,
    unit: nutrient.unit,
  });
  const summary = (food: Food) =>
    Object.fromEntries(SUMMARY_NUTRIENT_KEYS.map((key) => [key, food.nutrients[key] ?? null]));

  server.registerTool(
    'list_food_groups',
    {
      title: 'Danh sách nhóm thực phẩm',
      description: 'Liệt kê các nhóm thực phẩm (id, tên, số thực phẩm trong nhóm).',
      annotations: READ_ONLY,
    },
    () =>
      respond({
        groups: catalog.groups.map((g) => ({ ...g, foodCount: catalog.foodCount(g.id) })),
      }),
  );

  server.registerTool(
    'list_nutrients',
    {
      title: 'Danh sách chất dinh dưỡng',
      description: 'Liệt kê các chỉ số dinh dưỡng có trong dữ liệu (key, tên, đơn vị), theo nhóm chất.',
      inputSchema: {
        category: z.enum(categoryIds).optional().describe('Chỉ lấy một nhóm chất.'),
      },
      annotations: READ_ONLY,
    },
    ({ category }) =>
      respond({
        categories: catalog.categories
          .filter((c) => !category || c.id === category)
          .map((c) => ({
            ...c,
            nutrients: catalog.nutrientsInCategory(c.id).map((n) => ({
              key: n.key,
              name: n.name,
              nameEnglish: n.nameEnglish,
              unit: n.unit,
            })),
          })),
      }),
  );

  server.registerTool(
    'search_foods',
    {
      title: 'Tìm thực phẩm',
      description:
        'Tìm thực phẩm theo tên (tiếng Việt có/không dấu hoặc tiếng Anh) và/hoặc nhóm. ' +
        'Trả về năng lượng và các chất chính trên 100 g.',
      inputSchema: {
        query: z.string().max(100).optional().describe('Từ khoá, vd "ca" hoặc "egg". Bỏ trống để lấy tất cả.'),
        group: z.enum(groupIds).optional().describe('Id nhóm thực phẩm (xem list_food_groups).'),
        limit: z.number().int().min(1).max(100).default(20),
      },
      annotations: READ_ONLY,
    },
    ({ query, group, limit }) => {
      const foods = catalog.searchFoods({ query, group });
      return respond({
        total: foods.length,
        per: '100g',
        foods: foods.slice(0, limit).map((food) => ({ ...foodRef(food), nutrients: summary(food) })),
      });
    },
  );

  server.registerTool(
    'get_food',
    {
      title: 'Chi tiết dinh dưỡng thực phẩm',
      description:
        'Toàn bộ thành phần dinh dưỡng của một thực phẩm, quy đổi theo khối lượng (mặc định 100 g).',
      inputSchema: {
        food: z.string().min(1).describe('Id hoặc tên thực phẩm.'),
        grams: z.number().positive().max(10000).default(100),
        categories: z
          .array(z.enum(categoryIds))
          .optional()
          .describe('Chỉ lấy các nhóm chất này (mặc định: tất cả).'),
      },
      annotations: READ_ONLY,
    },
    ({ food: foodQuery, grams, categories }) =>
      safely(() => {
        const food = catalog.requireFood(foodQuery);
        const values = catalog.foodNutrients(food, grams);
        return {
          food: { ...foodRef(food), groupName: catalog.getGroup(food.group)?.name },
          grams,
          energySplitPercent: catalog.energySplit(values),
          nutrients: catalog.nutrients
            .filter((n) => !categories?.length || categories.includes(n.category))
            .map((n) => ({ ...nutrientRef(n), category: n.category, value: values[n.key] })),
        };
      }),
  );

  server.registerTool(
    'rank_foods_by_nutrient',
    {
      title: 'Xếp hạng thực phẩm theo chất dinh dưỡng',
      description:
        'Thực phẩm giàu (hoặc ít) một chất dinh dưỡng nhất, giá trị trên 100 g. ' +
        'Bỏ qua thực phẩm không có số liệu.',
      inputSchema: {
        nutrient: z.string().min(1).describe('Key hoặc tên chất, vd "vitaminC", "canxi", "protein".'),
        order: z.enum(['desc', 'asc']).default('desc').describe('desc = nhiều nhất trước.'),
        group: z.enum(groupIds).optional(),
        limit: z.number().int().min(1).max(100).default(10),
      },
      annotations: READ_ONLY,
    },
    ({ nutrient, order, group, limit }) =>
      safely(() => {
        const resolved = catalog.requireNutrient(nutrient);
        const ranked = catalog.rankFoods({ nutrient: resolved.key, order, group, limit });
        return {
          nutrient: nutrientRef(resolved),
          order,
          per: '100g',
          foods: ranked.map((r, i) => ({ rank: i + 1, ...foodRef(r.food), value: r.value })),
        };
      }),
  );

  server.registerTool(
    'compare_foods',
    {
      title: 'So sánh thực phẩm',
      description:
        'So sánh 2–10 thực phẩm theo các chất dinh dưỡng (trên 100 g). ' +
        'Mỗi hàng có values theo đúng thứ tự của foods. ' +
        'Mặc định so sánh năng lượng, chất chính, một số khoáng chất và vitamin.',
      inputSchema: {
        foods: z.array(z.string().min(1)).min(2).max(10).describe('Id hoặc tên thực phẩm.'),
        nutrients: z.array(z.string().min(1)).max(catalog.nutrients.length).optional().describe('Key hoặc tên chất.'),
      },
      annotations: READ_ONLY,
    },
    ({ foods, nutrients }) =>
      safely(() => {
        const comparison = catalog.compareFoods(foods, nutrients?.length ? nutrients : DEFAULT_COMPARE_KEYS);
        return {
          per: '100g',
          foods: comparison.foods.map(foodRef),
          rows: comparison.rows.map((row) => ({
            ...nutrientRef(row.nutrient),
            // Same order as `foods` (an object keyed by numeric ids would be re-sorted by JS).
            values: row.values,
            highestFoodId: row.highestIndex >= 0 ? comparison.foods[row.highestIndex].id : null,
          })),
        };
      }),
  );

  server.registerTool(
    'calculate_meal',
    {
      title: 'Tính dinh dưỡng bữa ăn',
      description:
        'Tổng hợp dinh dưỡng của một bữa ăn/thực đơn từ danh sách thực phẩm và khối lượng (gram). ' +
        'missingDataFor liệt kê thực phẩm không có số liệu cho chất đó (tổng có thể bị thiếu).',
      inputSchema: {
        items: z
          .array(
            z.object({
              food: z.string().min(1).describe('Id hoặc tên thực phẩm.'),
              grams: z.number().positive().max(10000),
            }),
          )
          .min(1)
          .max(50),
        nutrients: z
          .array(z.string().min(1))
          .max(catalog.nutrients.length)
          .optional()
          .describe('Chỉ trả về các chất này (mặc định: tất cả).'),
      },
      annotations: READ_ONLY,
    },
    ({ items, nutrients }) =>
      safely(() => {
        const meal = catalog.calculateMeal(
          items.map((item) => ({ foodId: catalog.requireFood(item.food).id, grams: item.grams })),
        );
        const wanted = nutrients?.length
          ? new Set(nutrients.map((n) => catalog.requireNutrient(n).key))
          : undefined;
        const totalsByKey = Object.fromEntries(meal.totals.map((t) => [t.nutrient.key, t.value]));
        return {
          items: meal.lines.map((line) => ({ ...foodRef(line.food), grams: line.grams })),
          totalGrams: meal.totalGrams,
          energySplitPercent: catalog.energySplit(totalsByKey),
          totals: meal.totals
            .filter((t) => !wanted || wanted.has(t.nutrient.key))
            .map((t) => ({
              ...nutrientRef(t.nutrient),
              value: t.value,
              ...(t.missingFoodIds.length ? { missingDataFor: t.missingFoodIds } : {}),
            })),
        };
      }),
  );

  return server;
}

function respond(payload: Record<string, unknown>): CallToolResult {
  return {
    content: [{ type: 'text', text: JSON.stringify(payload) }],
    structuredContent: payload,
  };
}

/** Turns lookup errors (unknown food/nutrient) into a tool error the model can read and recover from. */
function safely(build: () => Record<string, unknown>): CallToolResult {
  try {
    return respond(build());
  } catch (error) {
    return {
      content: [{ type: 'text', text: error instanceof Error ? error.message : String(error) }],
      isError: true,
    };
  }
}
