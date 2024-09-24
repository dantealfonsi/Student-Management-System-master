import { TestBed } from '@angular/core/testing';

import { SectionDataService } from './section-data.service';

describe('SectionDataService', () => {
  let service: SectionDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SectionDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
