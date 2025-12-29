import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lawton } from './lawton';

describe('Lawton', () => {
  let component: Lawton;
  let fixture: ComponentFixture<Lawton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lawton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lawton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
