import { TestBed } from '@angular/core/testing';

import { WebengageService } from './webengage.service';

describe('WebengageService', () => {
  let service: WebengageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebengageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
