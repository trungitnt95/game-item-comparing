import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BothItemValueComponent } from './both-item-value.component';

describe('BothItemValueComponent', () => {
  let component: BothItemValueComponent;
  let fixture: ComponentFixture<BothItemValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BothItemValueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BothItemValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
