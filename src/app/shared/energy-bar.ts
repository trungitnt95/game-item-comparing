import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { EnergySplit } from '@nutrition/core';
import { NumPipe } from './format';

/** Stacked bar showing where the energy comes from (protein / fat / carbohydrate). */
@Component({
  selector: 'app-energy-bar',
  imports: [NumPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (split(); as s) {
      <div class="bar" role="img" [attr.aria-label]="label(s)">
        <span class="protein" [style.width.%]="s.protein"></span>
        <span class="fat" [style.width.%]="s.fat"></span>
        <span class="carb" [style.width.%]="s.carbohydrate"></span>
      </div>
      <div class="legend">
        <span><i class="protein"></i>Protein {{ s.protein | num }}%</span>
        <span><i class="fat"></i>Chất béo {{ s.fat | num }}%</span>
        <span><i class="carb"></i>Glucid {{ s.carbohydrate | num }}%</span>
      </div>
    } @else {
      <p class="muted small">Không đủ số liệu để tính tỉ lệ năng lượng.</p>
    }
  `,
  styles: `
    .bar {
      display: flex;
      height: 12px;
      border-radius: 999px;
      overflow: hidden;
      background: var(--surface-2);
    }
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem 1rem;
      margin-top: 0.5rem;
      font-size: 0.85rem;
      color: var(--muted);
    }
    i {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 3px;
      margin-right: 0.35rem;
    }
    .protein {
      background: var(--protein);
    }
    .fat {
      background: var(--fat);
    }
    .carb {
      background: var(--carb);
    }
  `,
})
export class EnergyBar {
  readonly split = input<EnergySplit | null>(null);

  protected label(s: EnergySplit): string {
    return `Năng lượng từ protein ${s.protein}%, chất béo ${s.fat}%, glucid ${s.carbohydrate}%`;
  }
}
