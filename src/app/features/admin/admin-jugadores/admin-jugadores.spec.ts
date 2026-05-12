import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminJugadores } from './admin-jugadores';

describe('AdminJugadores', () => {
  let component: AdminJugadores;
  let fixture: ComponentFixture<AdminJugadores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminJugadores],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminJugadores);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
