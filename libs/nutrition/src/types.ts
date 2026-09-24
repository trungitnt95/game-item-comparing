/** Value of one nutrient per 100 g edible portion. `null` means the source table has no data. */
export type NutrientValue = number | null;

export interface FoodGroup {
  id: string;
  name: string;
  nameEnglish: string;
}

export interface NutrientCategory {
  id: string;
  name: string;
  nameEnglish: string;
}

export interface Nutrient {
  key: string;
  name: string;
  nameEnglish: string;
  unit: string;
  category: string;
}

export interface Food {
  id: string;
  name: string;
  nameEnglish: string;
  group: string;
  /** Keyed by {@link Nutrient.key}, values per 100 g. */
  nutrients: Record<string, NutrientValue>;
}

export interface NutritionDataset {
  groups: FoodGroup[];
  categories: NutrientCategory[];
  nutrients: Nutrient[];
  foods: Food[];
}

export interface SearchFoodsOptions {
  /** Free text, matched against Vietnamese (accent-insensitive) and English names. */
  query?: string;
  group?: string;
  limit?: number;
}

export interface RankFoodsOptions {
  nutrient: string;
  order?: 'asc' | 'desc';
  group?: string;
  limit?: number;
}

export interface RankedFood {
  food: Food;
  value: number;
}

export interface ComparisonRow {
  nutrient: Nutrient;
  values: NutrientValue[];
  /** Index (in `foods`) of the single highest value; -1 when fewer than two foods have data or the top is tied. */
  highestIndex: number;
}

export interface Comparison {
  foods: Food[];
  rows: ComparisonRow[];
}

export interface MealItemInput {
  foodId: string;
  grams: number;
}

export interface MealLine {
  food: Food;
  grams: number;
}

export interface MealTotal {
  nutrient: Nutrient;
  /** Sum over the foods that have data; `null` when none of them do. */
  value: number | null;
  /** Foods in the meal without data for this nutrient (the total under-counts them). */
  missingFoodIds: string[];
}

export interface MealResult {
  lines: MealLine[];
  totalGrams: number;
  totals: MealTotal[];
}

export interface EnergySplit {
  /** Share of energy (0–100) from protein, fat and carbohydrate, using 4/9/4 kcal per gram. */
  protein: number;
  fat: number;
  carbohydrate: number;
}
