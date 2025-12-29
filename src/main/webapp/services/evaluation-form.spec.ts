import { TestBed } from '@angular/core/testing';

import { EvaluationFormService } from './evaluation-form';

describe('EvaluationFormService', () => {
  let service: EvaluationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvaluationFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
