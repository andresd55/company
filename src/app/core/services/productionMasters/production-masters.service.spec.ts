import { TestBed } from '@angular/core/testing';

import { ProductionMastersService } from './production-masters.service';

describe('ProductionMastersService', () => {
  let service: ProductionMastersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionMastersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
