import { TestBed } from '@angular/core/testing';

import { InterventionsService } from './interventions.service';

describe('InterventionsService', () => {
  let service: InterventionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterventionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
