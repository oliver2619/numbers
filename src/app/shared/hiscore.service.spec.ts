import { TestBed } from '@angular/core/testing';

import { HiscoreService } from './hiscore.service';

describe('HiscoreService', () => {
  let service: HiscoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiscoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
