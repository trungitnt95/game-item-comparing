import { normalizeText, round, scaleValue } from './text';
import type {
  Comparison,
  EnergySplit,
  Food,
  FoodGroup,
  MealItemInput,
  MealResult,
  Nutrient,
  NutrientCategory,
  NutrientValue,
  NutritionDataset,
  RankedFood,
  RankFoodsOptions,
  SearchFoodsOptions,
} from './types';

/** Nutrients shown in summaries: energy and the main macronutrients. */
export const SUMMARY_NUTRIENT_KEYS = ['kCal', 'protein', 'lipit', 'glucid', 'celluloza'] as const;

interface IndexedFood {
  food: Food;
  name: string;
  haystack: string;
}

/**
 * Read-only, framework-agnostic query API over the nutrition dataset.
 * Shared by the web app and the MCP server so both answer the same way.
 */
export class NutritionCatalog {
  readonly groups: readonly FoodGroup[];
  readonly categories: readonly NutrientCategory[];
  readonly nutrients: readonly Nutrient[];
  readonly foods: readonly Food[];

  private readonly foodById = new Map<string, Food>();
  private readonly groupById = new Map<string, FoodGroup>();
  private readonly nutrientByKey = new Map<string, Nutrient>();
  private readonly nutrientByName = new Map<string, Nutrient>();
  private readonly index: IndexedFood[];

  constructor(dataset: NutritionDataset) {
    this.groups = dataset.groups;
    this.categories = dataset.categories;
    this.nutrients = dataset.nutrients;
    this.foods = dataset.foods;

    for (const group of dataset.groups) this.groupById.set(group.id, group);
    for (const nutrient of dataset.nutrients) {
      this.nutrientByKey.set(nutrient.key.toLowerCase(), nutrient);
      for (const alias of nutrientAliases(nutrient)) {
        // First wins, so "năng lượng" means kcal rather than kJ.
        if (!this.nutrientByName.has(alias)) this.nutrientByName.set(alias, nutrient);
      }
    }
    this.index = dataset.foods.map((food) => {
      this.foodById.set(food.id, food);
      const group = this.groupById.get(food.group);
      return {
        food,
        name: normalizeText(food.name),
        haystack: normalizeText(
          [food.name, food.nameEnglish, group?.name, group?.nameEnglish].join(' '),
        ),
      };
    });
  }

  getGroup(id: string): FoodGroup | undefined {
    return this.groupById.get(id);
  }

  getFood(id: string): Food | undefined {
    return this.foodById.get(id);
  }

  getNutrient(key: string): Nutrient | undefined {
    return this.nutrientByKey.get(key.toLowerCase());
  }

  foodCount(groupId: string): number {
    return this.foods.filter((food) => food.group === groupId).length;
  }

  nutrientsInCategory(categoryId: string): Nutrient[] {
    return this.nutrients.filter((nutrient) => nutrient.category === categoryId);
  }

  /** Resolves a food by id, exact name (vi/en, accent-insensitive) or a single fuzzy match. */
  findFood(idOrName: string): Food | undefined {
    const byId = this.foodById.get(idOrName.trim());
    if (byId) return byId;
    const needle = normalizeText(idOrName);
    if (!needle) return undefined;
    const exact = this.index.find(
      (entry) => entry.name === needle || normalizeText(entry.food.nameEnglish) === needle,
    );
    if (exact) return exact.food;
    const matches = this.searchFoods({ query: idOrName });
    return matches.length === 1 ? matches[0] : undefined;
  }

  /** Resolves a nutrient by key ("vitaminC"), name ("vitamin c", "canxi", "Calcium") or a unique partial name. */
  findNutrient(keyOrName: string): Nutrient | undefined {
    const byKey = this.getNutrient(keyOrName.trim());
    if (byKey) return byKey;
    const needle = normalizeText(keyOrName);
    if (!needle) return undefined;
    const exact = this.nutrientByName.get(needle);
    if (exact) return exact;
    const partial = new Set(
      [...this.nutrientByName].filter(([alias]) => alias.includes(needle)).map(([, n]) => n),
    );
    return partial.size === 1 ? [...partial][0] : undefined;
  }

  searchFoods({ query = '', group, limit }: SearchFoodsOptions = {}): Food[] {
    const tokens = normalizeText(query).split(' ').filter(Boolean);
    const phrase = tokens.join(' ');
    const scored = this.index
      .filter((entry) => !group || entry.food.group === group)
      .filter((entry) => tokens.every((token) => entry.haystack.includes(token)))
      .map((entry, order) => ({ entry, order, score: this.relevance(entry, phrase) }))
      .sort((a, b) => b.score - a.score || a.order - b.order)
      .map(({ entry }) => entry.food);
    return limit === undefined ? scored : scored.slice(0, limit);
  }

  rankFoods({ nutrient, order = 'desc', group, limit }: RankFoodsOptions): RankedFood[] {
    const key = this.requireNutrient(nutrient).key;
    const ranked = this.foods
      .filter((food) => !group || food.group === group)
      .flatMap((food) => {
        const value = food.nutrients[key];
        return value === null || value === undefined ? [] : [{ food, value }];
      })
      .sort((a, b) => (order === 'asc' ? a.value - b.value : b.value - a.value));
    return limit === undefined ? ranked : ranked.slice(0, limit);
  }

  compareFoods(foodIds: string[], nutrientKeys?: string[]): Comparison {
    const foods = foodIds.map((id) => this.requireFood(id));
    const nutrients = nutrientKeys?.length
      ? nutrientKeys.map((key) => this.requireNutrient(key))
      : [...this.nutrients];
    const rows = nutrients.map((nutrient) => {
      const values = foods.map((food) => food.nutrients[nutrient.key] ?? null);
      return { nutrient, values, highestIndex: highestIndex(values) };
    });
    return { foods, rows };
  }

  /** Values of one food scaled to `grams` (default 100 g). */
  foodNutrients(food: Food, grams = 100): Record<string, NutrientValue> {
    const scaled: Record<string, NutrientValue> = {};
    for (const nutrient of this.nutrients) {
      scaled[nutrient.key] = scaleValue(food.nutrients[nutrient.key] ?? null, grams);
    }
    return scaled;
  }

  calculateMeal(items: MealItemInput[]): MealResult {
    const lines = items.map((item) => {
      if (!Number.isFinite(item.grams) || item.grams < 0) {
        throw new Error(`Khối lượng không hợp lệ cho thực phẩm ${item.foodId}: ${item.grams}`);
      }
      return { food: this.requireFood(item.foodId), grams: item.grams };
    });
    const totals = this.nutrients.map((nutrient) => {
      let value: number | null = null;
      const missingFoodIds: string[] = [];
      for (const line of lines) {
        const scaled = scaleValue(line.food.nutrients[nutrient.key] ?? null, line.grams);
        if (scaled === null) {
          missingFoodIds.push(line.food.id);
        } else {
          value = (value ?? 0) + scaled;
        }
      }
      return { nutrient, value: value === null ? null : round(value), missingFoodIds };
    });
    const totalGrams = round(lines.reduce((sum, line) => sum + line.grams, 0));
    return { lines, totalGrams, totals };
  }

  /** Energy split by macronutrient, or `null` when the food has no macronutrient data. */
  energySplit(nutrients: Record<string, NutrientValue>): EnergySplit | null {
    const protein = (nutrients['protein'] ?? 0) * 4;
    const fat = (nutrients['lipit'] ?? 0) * 9;
    const carbohydrate = (nutrients['glucid'] ?? 0) * 4;
    const total = protein + fat + carbohydrate;
    if (total <= 0) return null;
    return {
      protein: round((protein / total) * 100, 1),
      fat: round((fat / total) * 100, 1),
      carbohydrate: round((carbohydrate / total) * 100, 1),
    };
  }

  requireFood(idOrName: string): Food {
    const food = this.findFood(idOrName);
    if (!food) throw new Error(`Không tìm thấy thực phẩm "${idOrName}".`);
    return food;
  }

  requireNutrient(keyOrName: string): Nutrient {
    const nutrient = this.findNutrient(keyOrName);
    if (!nutrient) throw new Error(`Không tìm thấy chất dinh dưỡng "${keyOrName}".`);
    return nutrient;
  }

  private relevance(entry: IndexedFood, phrase: string): number {
    if (!phrase) return 0;
    if (entry.name === phrase) return 3;
    if (entry.name.startsWith(phrase)) return 2;
    return entry.name.includes(phrase) ? 1 : 0;
  }
}

/** "Vitamin B1 (thiamin)" is also reachable as "vitamin b1" and "thiamin". */
function nutrientAliases(nutrient: Nutrient): string[] {
  const aliases = [nutrient.key];
  for (const name of [nutrient.name, nutrient.nameEnglish]) {
    aliases.push(name);
    const match = /^(.*?)\s*\((.*)\)$/.exec(name);
    if (match) aliases.push(match[1], match[2]);
  }
  return aliases.map(normalizeText).filter(Boolean);
}

function highestIndex(values: NutrientValue[]): number {
  const known = values.filter((value): value is number => value !== null);
  if (known.length < 2) return -1;
  const max = Math.max(...known);
  // A tie at the top (e.g. 0 vs 0) has no single winner.
  return known.filter((value) => value === max).length === 1 ? values.indexOf(max) : -1;
}
