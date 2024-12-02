import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentRelationComponent } from './student-relation.component';

describe('StudentRelationComponent', () => {
  let component: StudentRelationComponent;
  let fixture: ComponentFixture<StudentRelationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentRelationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
