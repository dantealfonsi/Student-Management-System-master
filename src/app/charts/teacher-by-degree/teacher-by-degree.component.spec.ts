import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherByDegreeComponent } from './teacher-by-degree.component';

describe('TeacherByDegreeComponent', () => {
  let component: TeacherByDegreeComponent;
  let fixture: ComponentFixture<TeacherByDegreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherByDegreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherByDegreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
