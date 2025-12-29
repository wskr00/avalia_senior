import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationOption } from './evaluation-option';

describe('EvaluationOption', () => {
  let component: EvaluationOption;
  let fixture: ComponentFixture<EvaluationOption>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationOption]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationOption);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
