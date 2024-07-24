import { TestBed } from '@angular/core/testing';

import { AssistedCustomersService } from './assisted-customers.service';

describe('AssistedCustomersService', () => {
  let service: AssistedCustomersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssistedCustomersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
