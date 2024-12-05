import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionTeacherComponent } from './section-teacher.component';

describe('SectionTeacherComponent', () => {
  let component: SectionTeacherComponent;
  let fixture: ComponentFixture<SectionTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionTeacherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
