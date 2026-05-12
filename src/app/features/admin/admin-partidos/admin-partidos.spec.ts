import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPartidos } from './admin-partidos';

describe('AdminPartidos', () => {
  let component: AdminPartidos;
  let fixture: ComponentFixture<AdminPartidos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPartidos],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPartidos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
