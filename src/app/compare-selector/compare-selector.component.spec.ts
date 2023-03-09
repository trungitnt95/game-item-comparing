import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareSelectorComponent } from './compare-selector.component';

describe('CompareSelectorComponent', () => {
  let component: CompareSelectorComponent;
  let fixture: ComponentFixture<CompareSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompareSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompareSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
