import { TestBed } from '@angular/core/testing';

import { ReadFileService } from './readFile.service';

describe('readFileService', () => {
  let service: ReadFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
