import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsByPeriodChartComponent } from './students-by-period-chart.component';

describe('StudentsByPeriodChartComponent', () => {
  let component: StudentsByPeriodChartComponent;
  let fixture: ComponentFixture<StudentsByPeriodChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsByPeriodChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentsByPeriodChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
