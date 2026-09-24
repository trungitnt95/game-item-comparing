import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NutritionCatalog } from '@nutrition/core';
import { addedFeedback } from '../../core/added-feedback';
import { CompareStore } from '../../core/compare-store';
import { MealStore } from '../../core/meal-store';
import { NumPipe } from '../../shared/format';

@Component({
  selector: 'app-foods-page',
  imports: [RouterLink, NumPipe],
  templateUrl: './foods-page.html',
  styleUrl: './foods-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoodsPage {
  protected readonly catalog = inject(NutritionCatalog);
  protected readonly compare = inject(CompareStore);
  protected readonly meal = inject(MealStore);
  protected readonly added = addedFeedback();
  private readonly router = inject(Router);

  /** Bound from the `?q=` and `?group=` query params so searches can be shared. */
  readonly q = input<string>();
  readonly group = input<string>();

  protected readonly query = linkedSignal(() => this.q() ?? '');
  protected readonly groupId = computed(() =>
    this.catalog.getGroup(this.group() ?? '') ? this.group() : undefined,
  );
  protected readonly results = computed(() =>
    this.catalog.searchFoods({ query: this.query(), group: this.groupId() }),
  );

  protected setQuery(value: string): void {
    this.query.set(value);
    this.syncUrl({ q: value.trim() || null });
  }

  protected setGroup(groupId: string | null): void {
    this.syncUrl({ group: groupId });
  }

  protected clearFilters(): void {
    this.query.set('');
    this.syncUrl({ q: null, group: null });
  }

  protected groupName(groupId: string): string {
    return this.catalog.getGroup(groupId)?.name ?? groupId;
  }

  protected addToMeal(foodId: string): void {
    this.meal.add(foodId, 100);
    this.added.mark(foodId);
  }

  private syncUrl(queryParams: Record<string, string | null>): void {
    void this.router.navigate([], { queryParams, queryParamsHandling: 'merge', replaceUrl: true });
  }
}
