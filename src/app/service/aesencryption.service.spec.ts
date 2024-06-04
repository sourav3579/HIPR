import { TestBed } from '@angular/core/testing';

import { AesencryptionService } from './aesencryption.service';

describe('AesencryptionService', () => {
  let service: AesencryptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AesencryptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
