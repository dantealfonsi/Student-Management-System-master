import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsByTurnComponent } from './students-by-turn.component';

describe('StudentsByTurnComponent', () => {
  let component: StudentsByTurnComponent;
  let fixture: ComponentFixture<StudentsByTurnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsByTurnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentsByTurnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
