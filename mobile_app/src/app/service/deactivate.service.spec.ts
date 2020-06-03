import { TestBed } from '@angular/core/testing';

import { DeactivateService } from './deactivate.service';

describe('DeactivateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeactivateService = TestBed.get(DeactivateService);
    expect(service).toBeTruthy();
  });
});
