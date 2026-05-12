import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminConvocatorias } from './admin-convocatorias';

describe('AdminConvocatorias', () => {
  let component: AdminConvocatorias;
  let fixture: ComponentFixture<AdminConvocatorias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminConvocatorias],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminConvocatorias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
