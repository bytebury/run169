import { TestBed } from '@angular/core/testing';

import { CompletedTownsService } from './completed-towns.service';

describe('CompletedTownsService', () => {
  let service: CompletedTownsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompletedTownsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
