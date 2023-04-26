import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SickDetailComponent } from './sick-detail.component';

describe('SickDetailComponent', () => {
  let component: SickDetailComponent;
  let fixture: ComponentFixture<SickDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SickDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SickDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
