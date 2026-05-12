import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pabellon } from './pabellon';

describe('Pabellon', () => {
  let component: Pabellon;
  let fixture: ComponentFixture<Pabellon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pabellon],
    }).compileComponents();

    fixture = TestBed.createComponent(Pabellon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
