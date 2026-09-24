import { inject } from '@angular/core';
import { ResolveFn, Routes } from '@angular/router';
import { NutritionCatalog } from '@nutrition/core';

const foodTitle: ResolveFn<string> = (route) =>
  inject(NutritionCatalog).getFood(route.paramMap.get('id') ?? '')?.name ?? 'Không tìm thấy thực phẩm';

export const routes: Routes = [
  {
    path: '',
    title: 'Tra cứu thực phẩm',
    loadComponent: () => import('./pages/foods/foods-page').then((m) => m.FoodsPage),
  },
  {
    path: 'foods/:id',
    title: foodTitle,
    loadComponent: () => import('./pages/food-detail/food-detail-page').then((m) => m.FoodDetailPage),
  },
  {
    path: 'nutrients',
    title: 'Tra cứu theo chất dinh dưỡng',
    loadComponent: () => import('./pages/nutrients/nutrients-page').then((m) => m.NutrientsPage),
  },
  {
    path: 'compare',
    title: 'So sánh thực phẩm',
    loadComponent: () => import('./pages/compare/compare-page').then((m) => m.ComparePage),
  },
  {
    path: 'meal',
    title: 'Tính dinh dưỡng bữa ăn',
    loadComponent: () => import('./pages/meal/meal-page').then((m) => m.MealPage),
  },
  {
    path: 'about',
    title: 'Giới thiệu & kết nối AI',
    loadComponent: () => import('./pages/about/about-page').then((m) => m.AboutPage),
  },
  { path: '**', redirectTo: '' },
];
