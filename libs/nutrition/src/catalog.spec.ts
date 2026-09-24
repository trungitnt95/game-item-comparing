import { describe, expect, it } from 'vitest';
import { NutritionCatalog } from './catalog';
import { nutritionCatalog as catalog, nutritionDataset } from './dataset';
import { normalizeText } from './text';

describe('dataset', () => {
  it('has a value (or explicit null) for every nutrient on every food', () => {
    const keys = catalog.nutrients.map((n) => n.key).sort();
    for (const food of catalog.foods) {
      expect(Object.keys(food.nutrients).sort()).toEqual(keys);
      for (const value of Object.values(food.nutrients)) {
        expect(value === null || (typeof value === 'number' && value >= 0)).toBe(true);
      }
    }
  });

  it('references only known groups and categories, with unique ids', () => {
    const groupIds = new Set(catalog.groups.map((g) => g.id));
    const categoryIds = new Set(catalog.categories.map((c) => c.id));
    expect(new Set(catalog.foods.map((f) => f.id)).size).toBe(catalog.foods.length);
    expect(catalog.foods.every((f) => groupIds.has(f.group))).toBe(true);
    expect(catalog.nutrients.every((n) => categoryIds.has(n.category))).toBe(true);
    expect(catalog.groups.every((g) => catalog.foodCount(g.id) > 0)).toBe(true);
  });
});

describe('normalizeText', () => {
  it('strips Vietnamese diacritics', () => {
    expect(normalizeText('Đậu xanh  Cà Chua')).toBe('dau xanh ca chua');
  });
});

describe('searchFoods', () => {
  it('matches without accents and in English', () => {
    expect(catalog.searchFoods({ query: 'ca chua' })[0].name).toBe('Cà chua');
    expect(catalog.searchFoods({ query: 'salmon' }).map((f) => f.name)).toEqual(['Cá hồi']);
  });

  it('filters by group and ranks name prefix matches first', () => {
    const results = catalog.searchFoods({ query: 'trứng', group: 'TRUNG' });
    expect(results.every((f) => f.group === 'TRUNG')).toBe(true);
    expect(results[0].name).toBe('Trứng gà');
  });

  it('returns everything for an empty query and honours limit', () => {
    expect(catalog.searchFoods()).toHaveLength(catalog.foods.length);
    expect(catalog.searchFoods({ limit: 3 })).toHaveLength(3);
  });
});

describe('findFood / findNutrient', () => {
  it('resolves foods by id or name', () => {
    expect(catalog.findFood('5040')?.name).toBe('Ổi');
    expect(catalog.findFood('oi')?.id).toBe('5040');
    expect(catalog.findFood('Guava')?.id).toBe('5040');
    expect(catalog.findFood('không có')).toBeUndefined();
  });

  it('resolves nutrients by key, Vietnamese/English name or unique partial name', () => {
    expect(catalog.findNutrient('vitaminC')?.key).toBe('vitaminC');
    expect(catalog.findNutrient('Vitamin C')?.key).toBe('vitaminC');
    expect(catalog.findNutrient('canxi')?.key).toBe('calci');
    expect(catalog.findNutrient('Iron')?.key).toBe('sat');
    expect(catalog.findNutrient('chất béo')?.key).toBe('lipit');
    expect(catalog.findNutrient('năng lượng')?.key).toBe('kCal');
    expect(catalog.findNutrient('b12')?.key).toBe('vitaminB12');
    expect(catalog.findNutrient('omega-3')).toBeUndefined();
  });
});

describe('rankFoods', () => {
  it('sorts by the nutrient and skips foods without data', () => {
    const ranked = catalog.rankFoods({ nutrient: 'vitaminC', limit: 3 });
    const best = Math.max(...catalog.foods.map((f) => f.nutrients['vitaminC'] ?? -1));
    expect(ranked).toHaveLength(3);
    expect(ranked[0].value).toBe(best);
    expect(ranked.map((r) => r.value)).toEqual([...ranked.map((r) => r.value)].sort((a, b) => b - a));

    const purine = catalog.rankFoods({ nutrient: 'purin' });
    const withoutData = catalog.foods.filter((f) => f.nutrients['purin'] === null).length;
    expect(purine).toHaveLength(catalog.foods.length - withoutData);
  });

  it('supports ascending order and group filter', () => {
    const ranked = catalog.rankFoods({ nutrient: 'kCal', order: 'asc', group: 'QUA' });
    expect(ranked.every((r) => r.food.group === 'QUA')).toBe(true);
    expect(ranked[0].value).toBeLessThanOrEqual(ranked[ranked.length - 1].value);
  });

  it('rejects unknown nutrients', () => {
    expect(() => catalog.rankFoods({ nutrient: 'kryptonite' })).toThrow(/kryptonite/);
  });
});

describe('compareFoods', () => {
  it('builds one row per requested nutrient and marks the highest value', () => {
    const comparison = catalog.compareFoods(['9001', '9004'], ['protein', 'lipit']);
    expect(comparison.foods.map((f) => f.id)).toEqual(['9001', '9004']);
    expect(comparison.rows.map((r) => r.nutrient.key)).toEqual(['protein', 'lipit']);
    const protein = comparison.rows[0];
    expect(protein.values[protein.highestIndex]).toBe(Math.max(...(protein.values as number[])));
  });

  it('marks no winner when the top value is tied', () => {
    const tied = catalog.foods.filter((f) => f.nutrients['celluloza'] === 0).slice(0, 2);
    expect(tied).toHaveLength(2);
    const row = catalog.compareFoods(tied.map((f) => f.id), ['celluloza']).rows[0];
    expect(row.highestIndex).toBe(-1);
  });
});

describe('calculateMeal', () => {
  it('scales per-100 g values by grams and sums them', () => {
    const rice = catalog.getFood('1002')!;
    const egg = catalog.getFood('9001')!;
    const meal = catalog.calculateMeal([
      { foodId: '1002', grams: 150 },
      { foodId: '9001', grams: 50 },
    ]);
    const kcal = meal.totals.find((t) => t.nutrient.key === 'kCal')!;
    expect(meal.totalGrams).toBe(200);
    expect(kcal.value).toBeCloseTo(rice.nutrients['kCal']! * 1.5 + egg.nutrients['kCal']! * 0.5, 3);
    expect(kcal.missingFoodIds).toEqual([]);
  });

  it('reports foods without data instead of treating them as zero', () => {
    const food = catalog.foods.find((f) => f.nutrients['purin'] === null)!;
    const meal = catalog.calculateMeal([{ foodId: food.id, grams: 100 }]);
    const purine = meal.totals.find((t) => t.nutrient.key === 'purin')!;
    expect(purine.value).toBeNull();
    expect(purine.missingFoodIds).toEqual([food.id]);
  });

  it('rejects negative grams and unknown foods', () => {
    expect(() => catalog.calculateMeal([{ foodId: '1002', grams: -1 }])).toThrow();
    expect(() => catalog.calculateMeal([{ foodId: 'nope', grams: 10 }])).toThrow(/nope/);
  });
});

describe('energySplit', () => {
  it('returns percentages that add up to ~100', () => {
    const split = catalog.energySplit(catalog.getFood('9001')!.nutrients)!;
    expect(split.protein + split.fat + split.carbohydrate).toBeCloseTo(100, 0);
  });

  it('returns null without macronutrient data', () => {
    const empty = new NutritionCatalog({ ...nutritionDataset, foods: [] });
    expect(empty.energySplit({})).toBeNull();
  });
});
