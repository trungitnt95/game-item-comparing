import { computed, Injectable, inject } from '@angular/core';
import { NutritionCatalog, type Food } from '@nutrition/core';
import { persistedSignal } from './persisted-signal';

export const MAX_COMPARE = 6;

const isIdList = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((id) => typeof id === 'string');

/** Foods picked for side-by-side comparison. */
@Injectable({ providedIn: 'root' })
export class CompareStore {
  private readonly catalog = inject(NutritionCatalog);
  private readonly ids = persistedSignal<string[]>('nutrition-health.compare', [], isIdList);

  readonly foods = computed<Food[]>(() =>
    this.ids().flatMap((id) => this.catalog.getFood(id) ?? []),
  );
  readonly count = computed(() => this.foods().length);
  readonly isFull = computed(() => this.count() >= MAX_COMPARE);

  has(foodId: string): boolean {
    return this.ids().includes(foodId);
  }

  add(foodId: string): void {
    if (this.has(foodId) || this.isFull() || !this.catalog.getFood(foodId)) return;
    this.ids.update((ids) => [...ids, foodId]);
  }

  remove(foodId: string): void {
    this.ids.update((ids) => ids.filter((id) => id !== foodId));
  }

  toggle(foodId: string): void {
    if (this.has(foodId)) this.remove(foodId);
    else this.add(foodId);
  }

  clear(): void {
    this.ids.set([]);
  }
}
