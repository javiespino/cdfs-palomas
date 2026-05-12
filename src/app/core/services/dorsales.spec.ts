import { TestBed } from '@angular/core/testing';

import { Dorsales } from './dorsales';

describe('Dorsales', () => {
  let service: Dorsales;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dorsales);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
