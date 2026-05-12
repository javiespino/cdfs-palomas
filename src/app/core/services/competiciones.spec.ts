import { TestBed } from '@angular/core/testing';

import { Competiciones } from './competiciones';

describe('Competiciones', () => {
  let service: Competiciones;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Competiciones);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
