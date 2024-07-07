import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRegistrationComponent } from './view-registration.component';

describe('ViewRegistrationComponent', () => {
  let component: ViewRegistrationComponent;
  let fixture: ComponentFixture<ViewRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
