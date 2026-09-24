import { TestBed } from '@angular/core/testing';
import { NutritionCatalog, nutritionCatalog } from '@nutrition/core';
import { CompareStore, MAX_COMPARE } from './compare-store';
import { MealStore } from './meal-store';

describe('stores', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [{ provide: NutritionCatalog, useValue: nutritionCatalog }],
    });
  });

  describe('MealStore', () => {
    it('adds foods, merges grams for the same food and totals the meal', () => {
      const store = TestBed.inject(MealStore);
      store.add('1002', 100);
      store.add('1002', 50);
      store.add('9001', 60);
      expect(store.items()).toEqual([
        { foodId: '1002', grams: 150 },
        { foodId: '9001', grams: 60 },
      ]);
      expect(store.result().totalGrams).toBe(210);
    });

    it('ignores unknown foods and invalid grams', () => {
      const store = TestBed.inject(MealStore);
      store.add('nope', 100);
      store.add('1002', 0);
      expect(store.count()).toBe(0);
      store.add('1002', 100);
      store.setGrams('1002', -5);
      expect(store.items()[0].grams).toBe(100);
    });

    it('persists to localStorage and ignores corrupt storage', () => {
      const store = TestBed.inject(MealStore);
      store.add('5040', 80);
      TestBed.tick();
      expect(JSON.parse(localStorage.getItem('nutrition-health.meal')!)).toEqual([
        { foodId: '5040', grams: 80 },
      ]);

      localStorage.setItem('nutrition-health.meal', '{broken');
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [{ provide: NutritionCatalog, useValue: nutritionCatalog }],
      });
      expect(TestBed.inject(MealStore).count()).toBe(0);
    });
  });

  describe('CompareStore', () => {
    it('toggles foods and caps the list', () => {
      const store = TestBed.inject(CompareStore);
      store.toggle('5001');
      expect(store.has('5001')).toBe(true);
      store.toggle('5001');
      expect(store.count()).toBe(0);

      nutritionCatalog.foods.slice(0, MAX_COMPARE + 2).forEach((f) => store.add(f.id));
      expect(store.count()).toBe(MAX_COMPARE);
      expect(store.isFull()).toBe(true);
    });
  });
});
