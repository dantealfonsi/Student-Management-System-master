import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkChargeComponent } from './work-charge.component';

describe('WorkChargeComponent', () => {
  let component: WorkChargeComponent;
  let fixture: ComponentFixture<WorkChargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkChargeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
