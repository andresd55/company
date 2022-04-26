import { TestBed } from '@angular/core/testing';

import { InterceptorsTokenService } from './interceptors-token.service';

describe('InterceptorsTokenService', () => {
  let service: InterceptorsTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterceptorsTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
