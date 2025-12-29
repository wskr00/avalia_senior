import { TestBed } from '@angular/core/testing';

import { EvaluationCalculatorService } from './evaluation-calculator';

describe('EvaluationCalculatorService', () => {
  let service: EvaluationCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvaluationCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
