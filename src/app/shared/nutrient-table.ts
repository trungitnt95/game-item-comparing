import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NutritionCatalog, type NutrientValue } from '@nutrition/core';
import { NumPipe } from './format';

/** All nutrients grouped by category, for one set of values (a food or a meal total). */
@Component({
  selector: 'app-nutrient-table',
  imports: [NumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Chất dinh dưỡng</th>
            <th scope="col" class="num">{{ valueLabel() }}</th>
            <th scope="col">Đơn vị</th>
          </tr>
        </thead>
        <tbody>
          @for (section of sections(); track section.category.id) {
            <tr class="category-row">
              <th colspan="3" scope="colgroup">{{ section.category.name }}</th>
            </tr>
            @for (nutrient of section.nutrients; track nutrient.key) {
              <tr>
                <td>
                  {{ nutrient.name }}
                  @if (notes()[nutrient.key]; as note) {
                    <div class="muted small">{{ note }}</div>
                  }
                </td>
                <td class="num" [attr.title]="values()[nutrient.key] === null ? 'Không có số liệu' : null">
                  {{ values()[nutrient.key] | num }}
                </td>
                <td class="muted">{{ nutrient.unit }}</td>
              </tr>
            }
          }
        </tbody>
      </table>
    </div>
  `,
})
export class NutrientTable {
  private readonly catalog = inject(NutritionCatalog);

  readonly values = input.required<Record<string, NutrientValue>>();
  readonly valueLabel = input('Giá trị');
  /** Optional per-nutrient footnote, e.g. which foods lack data. */
  readonly notes = input<Record<string, string>>({});

  protected readonly sections = computed(() =>
    this.catalog.categories.map((category) => ({
      category,
      nutrients: this.catalog.nutrientsInCategory(category.id),
    })),
  );
}
