import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherByQualificationComponent } from './teacher-by-qualification.component';

describe('TeacherByQualificationComponent', () => {
  let component: TeacherByQualificationComponent;
  let fixture: ComponentFixture<TeacherByQualificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherByQualificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherByQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
