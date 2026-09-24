import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NutritionCatalog, SUMMARY_NUTRIENT_KEYS } from '@nutrition/core';
import { addedFeedback } from '../../core/added-feedback';
import { CompareStore } from '../../core/compare-store';
import { MealStore } from '../../core/meal-store';
import { EnergyBar } from '../../shared/energy-bar';
import { NumPipe } from '../../shared/format';
import { NutrientTable } from '../../shared/nutrient-table';

const QUICK_GRAMS = [50, 100, 150, 200];

@Component({
  selector: 'app-food-detail-page',
  imports: [RouterLink, NumPipe, EnergyBar, NutrientTable],
  templateUrl: './food-detail-page.html',
  styleUrl: './food-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoodDetailPage {
  private readonly catalog = inject(NutritionCatalog);
  protected readonly compare = inject(CompareStore);
  private readonly meal = inject(MealStore);
  protected readonly added = addedFeedback();
  protected readonly quickGrams = QUICK_GRAMS;

  /** Route parameter `:id`. */
  readonly id = input.required<string>();

  protected readonly food = computed(() => this.catalog.getFood(this.id()));
  protected readonly group = computed(() => this.catalog.getGroup(this.food()?.group ?? ''));
  protected readonly grams = linkedSignal({ source: this.id, computation: () => 100 });
  protected readonly values = computed(() => {
    const food = this.food();
    return food ? this.catalog.foodNutrients(food, this.grams()) : {};
  });
  protected readonly split = computed(() => this.catalog.energySplit(this.values()));
  protected readonly summary = computed(() =>
    SUMMARY_NUTRIENT_KEYS.map((key) => ({
      nutrient: this.catalog.getNutrient(key)!,
      value: this.values()[key] ?? null,
    })),
  );
  protected readonly missingCount = computed(
    () => Object.values(this.food()?.nutrients ?? {}).filter((v) => v === null).length,
  );
  protected readonly sameGroup = computed(() => {
    const food = this.food();
    return food ? this.catalog.searchFoods({ group: food.group }).filter((f) => f.id !== food.id) : [];
  });

  protected setGrams(raw: string): void {
    const grams = Number(raw);
    if (Number.isFinite(grams) && grams >= 0 && grams <= 10000) this.grams.set(grams);
  }

  protected addToMeal(): void {
    const food = this.food();
    if (!food || !(this.grams() > 0)) return;
    this.meal.add(food.id, this.grams());
    this.added.mark(food.id);
  }
}
