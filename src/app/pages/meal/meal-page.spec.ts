import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NutritionCatalog, nutritionCatalog } from '@nutrition/core';
import { MealStore } from '../../core/meal-store';
import { MealPage } from './meal-page';

describe('MealPage', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [MealPage],
      providers: [provideRouter([]), { provide: NutritionCatalog, useValue: nutritionCatalog }],
    }).compileComponents();
  });

  it('shows totals and flags foods without data', async () => {
    const store = TestBed.inject(MealStore);
    const withPurine = nutritionCatalog.foods.find((f) => f.nutrients['purin'] !== null)!;
    const withoutPurine = nutritionCatalog.foods.find((f) => f.nutrients['purin'] === null)!;
    store.add(withPurine.id, 200);
    store.add(withoutPurine.id, 100);

    const fixture = TestBed.createComponent(MealPage);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelectorAll('.items li')).toHaveLength(2);
    const expectedKcal = nutritionCatalog.calculateMeal(store.items()).totals.find(
      (t) => t.nutrient.key === 'kCal',
    )!.value!;
    expect(el.querySelector('.tile-value')?.textContent).toContain(
      new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(expectedKcal),
    );
    expect(el.textContent).toContain(`Thiếu số liệu: ${withoutPurine.name}`);
  });
});
