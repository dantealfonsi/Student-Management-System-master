import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherGenderChartComponent } from './teacher-gender-chart.component';

describe('TeacherGenderChartComponent', () => {
  let component: TeacherGenderChartComponent;
  let fixture: ComponentFixture<TeacherGenderChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherGenderChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherGenderChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
