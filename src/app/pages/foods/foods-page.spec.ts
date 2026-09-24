import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NutritionCatalog, nutritionCatalog } from '@nutrition/core';
import { FoodsPage } from './foods-page';

describe('FoodsPage', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [FoodsPage],
      providers: [provideRouter([]), { provide: NutritionCatalog, useValue: nutritionCatalog }],
    }).compileComponents();
  });

  const titles = (el: HTMLElement) => [...el.querySelectorAll('.food-card h2')].map((h) => h.textContent?.trim());

  it('lists every food by default', async () => {
    const fixture = TestBed.createComponent(FoodsPage);
    await fixture.whenStable();
    expect(titles(fixture.nativeElement)).toHaveLength(nutritionCatalog.foods.length);
  });

  it('filters by the q and group query params', async () => {
    const fixture = TestBed.createComponent(FoodsPage);
    fixture.componentRef.setInput('q', 'ca');
    fixture.componentRef.setInput('group', 'THUY_SAN');
    await fixture.whenStable();
    const names = titles(fixture.nativeElement);
    expect(names.length).toBeGreaterThan(0);
    expect(names.every((name) => name?.startsWith('Cá') || name?.includes('Cua'))).toBe(true);
    expect(names).not.toContain('Cà chua');
  });

  it('shows an empty state when nothing matches', async () => {
    const fixture = TestBed.createComponent(FoodsPage);
    fixture.componentRef.setInput('q', 'không-tồn-tại');
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('.empty-state')).not.toBeNull();
  });
});
