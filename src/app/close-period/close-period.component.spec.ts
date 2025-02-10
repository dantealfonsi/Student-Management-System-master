import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosePeriodComponent } from './close-period.component';

describe('ClosePeriodComponent', () => {
  let component: ClosePeriodComponent;
  let fixture: ComponentFixture<ClosePeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClosePeriodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClosePeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
