import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPeriodComponent } from './view-period.component';

describe('ViewPeriodComponent', () => {
  let component: ViewPeriodComponent;
  let fixture: ComponentFixture<ViewPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPeriodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
