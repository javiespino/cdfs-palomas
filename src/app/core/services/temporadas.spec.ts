import { TestBed } from '@angular/core/testing';

import { Temporadas } from './temporadas';

describe('Temporadas', () => {
  let service: Temporadas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Temporadas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
