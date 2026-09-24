import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NutritionCatalog } from '@nutrition/core';
import { NumPipe } from '../../shared/format';

const QUICK_PICKS = ['kCal', 'protein', 'celluloza', 'calci', 'sat', 'kali', 'natri', 'vitaminA', 'vitaminC', 'cholesterol'];
const DEFAULT_NUTRIENT = 'protein';

@Component({
  selector: 'app-nutrients-page',
  imports: [RouterLink, NumPipe],
  templateUrl: './nutrients-page.html',
  styleUrl: './nutrients-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NutrientsPage {
  protected readonly catalog = inject(NutritionCatalog);
  private readonly router = inject(Router);

  /** Query params: `?n=vitaminC&order=asc&group=QUA`. */
  readonly n = input<string>();
  readonly order = input<string>();
  readonly group = input<string>();

  protected readonly quickPicks = QUICK_PICKS.map((key) => this.catalog.getNutrient(key)!);
  protected readonly sections = this.catalog.categories.map((category) => ({
    category,
    nutrients: this.catalog.nutrientsInCategory(category.id),
  }));

  protected readonly nutrient = computed(
    () => this.catalog.getNutrient(this.n() ?? '') ?? this.catalog.getNutrient(DEFAULT_NUTRIENT)!,
  );
  protected readonly ascending = computed(() => this.order() === 'asc');
  protected readonly groupId = computed(() =>
    this.catalog.getGroup(this.group() ?? '') ? this.group() : undefined,
  );
  protected readonly ranking = computed(() =>
    this.catalog.rankFoods({
      nutrient: this.nutrient().key,
      order: this.ascending() ? 'asc' : 'desc',
      group: this.groupId(),
    }),
  );
  protected readonly maxValue = computed(() => Math.max(0, ...this.ranking().map((r) => r.value)));
  protected readonly withoutData = computed(() =>
    this.catalog
      .searchFoods({ group: this.groupId() })
      .filter((food) => food.nutrients[this.nutrient().key] === null),
  );

  protected select(queryParams: Record<string, string | null>): void {
    void this.router.navigate([], { queryParams, queryParamsHandling: 'merge', replaceUrl: true });
  }

  protected groupName(groupId: string): string {
    return this.catalog.getGroup(groupId)?.name ?? groupId;
  }

  protected barWidth(value: number): number {
    const max = this.maxValue();
    return max > 0 ? Math.max(1, (value / max) * 100) : 0;
  }
}
