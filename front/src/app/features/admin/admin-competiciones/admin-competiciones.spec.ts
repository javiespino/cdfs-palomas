import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCompeticiones } from './admin-competiciones';

describe('AdminCompeticiones', () => {
  let component: AdminCompeticiones;
  let fixture: ComponentFixture<AdminCompeticiones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCompeticiones],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCompeticiones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
