import { TestBed } from '@angular/core/testing';

import { CuerpoTecnico } from './cuerpo-tecnico';

describe('CuerpoTecnico', () => {
  let service: CuerpoTecnico;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuerpoTecnico);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
