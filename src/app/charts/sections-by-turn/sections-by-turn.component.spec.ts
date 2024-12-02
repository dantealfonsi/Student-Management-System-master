import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionsByTurnComponent } from './sections-by-turn.component';

describe('SectionsByTurnComponent', () => {
  let component: SectionsByTurnComponent;
  let fixture: ComponentFixture<SectionsByTurnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionsByTurnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionsByTurnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
