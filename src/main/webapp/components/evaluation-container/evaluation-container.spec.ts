import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationContainer } from './evaluation-container';

describe('EvaluationContainer', () => {
  let component: EvaluationContainer;
  let fixture: ComponentFixture<EvaluationContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
