import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NutritionCatalog, SUMMARY_NUTRIENT_KEYS } from '@nutrition/core';
import { MealStore } from '../../core/meal-store';
import { EnergyBar } from '../../shared/energy-bar';
import { FoodPicker } from '../../shared/food-picker';
import { NumPipe } from '../../shared/format';
import { NutrientTable } from '../../shared/nutrient-table';

@Component({
  selector: 'app-meal-page',
  imports: [RouterLink, NumPipe, EnergyBar, FoodPicker, NutrientTable],
  templateUrl: './meal-page.html',
  styleUrl: './meal-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MealPage {
  private readonly catalog = inject(NutritionCatalog);
  protected readonly store = inject(MealStore);

  protected readonly newGrams = signal(100);
  protected readonly result = this.store.result;
  protected readonly values = computed(() =>
    Object.fromEntries(this.result().totals.map((t) => [t.nutrient.key, t.value])),
  );
  protected readonly summary = computed(() =>
    SUMMARY_NUTRIENT_KEYS.map((key) => ({
      nutrient: this.catalog.getNutrient(key)!,
      value: this.values()[key] ?? null,
    })),
  );
  protected readonly split = computed(() => this.catalog.energySplit(this.values()));
  /** Footnotes naming the foods that have no data for a nutrient. */
  protected readonly notes = computed(() => {
    const notes: Record<string, string> = {};
    for (const total of this.result().totals) {
      if (total.missingFoodIds.length) {
        const names = total.missingFoodIds.map((id) => this.catalog.getFood(id)?.name ?? id);
        notes[total.nutrient.key] = `Thiếu số liệu: ${names.join(', ')}`;
      }
    }
    return notes;
  });

  protected setNewGrams(raw: string): void {
    const grams = Number(raw);
    if (Number.isFinite(grams) && grams > 0) this.newGrams.set(grams);
  }

  protected setGrams(foodId: string, raw: string): void {
    this.store.setGrams(foodId, Number(raw));
  }
}
