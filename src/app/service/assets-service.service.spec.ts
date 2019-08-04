import { TestBed } from '@angular/core/testing';

import { AssetsServiceService } from './assets-service.service';

describe('AssetsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssetsServiceService = TestBed.get(AssetsServiceService);
    expect(service).toBeTruthy();
  });
});
