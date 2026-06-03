import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTemporadas } from './admin-temporadas';

describe('AdminTemporadas', () => {
  let component: AdminTemporadas;
  let fixture: ComponentFixture<AdminTemporadas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTemporadas],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTemporadas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
