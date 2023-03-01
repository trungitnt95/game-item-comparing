import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemComparingComponent } from './item-comparing.component';

describe('ItemComparingComponent', () => {
  let component: ItemComparingComponent;
  let fixture: ComponentFixture<ItemComparingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemComparingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemComparingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
