import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { NutritionCatalog } from '@nutrition/core';

/** Food dropdown grouped by food group. Emits the picked food id and resets. */
@Component({
  selector: 'app-food-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="visually-hidden" [attr.for]="id()">{{ placeholder() }}</label>
    <select #picker class="select" [id]="id()" [disabled]="disabled()" (change)="pick(picker)">
      <option value="">{{ placeholder() }}</option>
      @for (group of groups(); track group.id) {
        <optgroup [label]="group.name">
          @for (food of group.foods; track food.id) {
            <option [value]="food.id" [disabled]="exclude().includes(food.id)">{{ food.name }}</option>
          }
        </optgroup>
      }
    </select>
  `,
})
export class FoodPicker {
  private readonly catalog = inject(NutritionCatalog);

  readonly id = input('food-picker');
  readonly placeholder = input('Chọn thực phẩm…');
  readonly exclude = input<string[]>([]);
  readonly disabled = input(false);
  readonly picked = output<string>();

  protected readonly groups = computed(() =>
    this.catalog.groups.map((group) => ({
      ...group,
      foods: this.catalog.foods.filter((food) => food.group === group.id),
    })),
  );

  protected pick(select: HTMLSelectElement): void {
    if (select.value) this.picked.emit(select.value);
    select.value = '';
  }
}
