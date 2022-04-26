import { TestBed } from '@angular/core/testing';

import { MasterProductService } from './master-product.service';

describe('MasterProductService', () => {
  let service: MasterProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
