import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NutritionCatalog, nutritionCatalog } from '@nutrition/core';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), { provide: NutritionCatalog, useValue: nutritionCatalog }],
    }).compileComponents();
  });

  it('renders the brand, main navigation and data source', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.brand')?.textContent).toContain('Dinh Dưỡng & Sức Khoẻ');
    const links = [...el.querySelectorAll('nav a')].map((a) => a.textContent?.trim());
    expect(links).toEqual(['Thực phẩm', 'Chất dinh dưỡng', 'So sánh', 'Bữa ăn', 'Giới thiệu & AI']);
    expect(el.querySelector('footer')?.textContent).toContain('VTN_FCT_2007');
  });
});
