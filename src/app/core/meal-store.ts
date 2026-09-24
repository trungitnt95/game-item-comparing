import { computed, Injectable, inject } from '@angular/core';
import { NutritionCatalog, type MealItemInput } from '@nutrition/core';
import { persistedSignal } from './persisted-signal';

const isMeal = (value: unknown): value is MealItemInput[] =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      typeof item?.foodId === 'string' && typeof item?.grams === 'number' && item.grams >= 0,
  );

/** Foods (with grams) of the meal being calculated; kept in the browser only. */
@Injectable({ providedIn: 'root' })
export class MealStore {
  private readonly catalog = inject(NutritionCatalog);
  private readonly state = persistedSignal<MealItemInput[]>('nutrition-health.meal', [], isMeal);

  readonly items = computed(() =>
    this.state().filter((item) => this.catalog.getFood(item.foodId) !== undefined),
  );
  readonly count = computed(() => this.items().length);
  readonly result = computed(() => this.catalog.calculateMeal(this.items()));

  add(foodId: string, grams = 100): void {
    if (!this.catalog.getFood(foodId) || !(grams > 0)) return;
    this.state.update((items) =>
      items.some((item) => item.foodId === foodId)
        ? items.map((item) => (item.foodId === foodId ? { ...item, grams: item.grams + grams } : item))
        : [...items, { foodId, grams }],
    );
  }

  setGrams(foodId: string, grams: number): void {
    if (!Number.isFinite(grams) || grams < 0) return;
    this.state.update((items) =>
      items.map((item) => (item.foodId === foodId ? { ...item, grams } : item)),
    );
  }

  remove(foodId: string): void {
    this.state.update((items) => items.filter((item) => item.foodId !== foodId));
  }

  clear(): void {
    this.state.set([]);
  }
}
