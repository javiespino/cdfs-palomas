import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCuerpoTecnico } from './admin-cuerpo-tecnico';

describe('AdminCuerpoTecnico', () => {
  let component: AdminCuerpoTecnico;
  let fixture: ComponentFixture<AdminCuerpoTecnico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCuerpoTecnico],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCuerpoTecnico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
