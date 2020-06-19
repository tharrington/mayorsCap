import { TestBed } from '@angular/core/testing';

import { MayorDataService } from './mayor-data.service';

describe('MayorDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MayorDataService = TestBed.get(MayorDataService);
    expect(service).toBeTruthy();
  });
});
