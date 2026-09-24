import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DATA_SOURCE } from '@nutrition/core';
import { APP_NAME } from './core/app-title-strategy';
import { CompareStore } from './core/compare-store';
import { MealStore } from './core/meal-store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly appName = APP_NAME;
  protected readonly dataSource = DATA_SOURCE;
  protected readonly compare = inject(CompareStore);
  protected readonly meal = inject(MealStore);
}
