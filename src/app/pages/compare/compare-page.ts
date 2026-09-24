import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NutritionCatalog } from '@nutrition/core';
import { CompareStore, MAX_COMPARE } from '../../core/compare-store';
import { NumPipe } from '../../shared/format';
import { FoodPicker } from '../../shared/food-picker';

const ALL = 'all';

@Component({
  selector: 'app-compare-page',
  imports: [RouterLink, NumPipe, FoodPicker],
  templateUrl: './compare-page.html',
  styleUrl: './compare-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparePage {
  protected readonly catalog = inject(NutritionCatalog);
  protected readonly store = inject(CompareStore);
  protected readonly maxCompare = MAX_COMPARE;
  protected readonly all = ALL;

  protected readonly category = signal<string>('general');
  protected readonly foodIds = computed(() => this.store.foods().map((f) => f.id));
  protected readonly sections = computed(() => {
    const foods = this.foodIds();
    if (foods.length === 0) return [];
    return this.catalog.categories
      .filter((c) => this.category() === ALL || c.id === this.category())
      .map((category) => ({
        category,
        rows: this.catalog.compareFoods(
          foods,
          this.catalog.nutrientsInCategory(category.id).map((n) => n.key),
        ).rows,
      }));
  });
}
