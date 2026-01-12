import { TestBed } from '@angular/core/testing';

import { TestSignalService } from './test-signal.service';

describe('TestSignalService', () => {
  let service: TestSignalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestSignalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
