import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationSection } from './evaluation-section';

describe('EvaluationSection', () => {
  let component: EvaluationSection;
  let fixture: ComponentFixture<EvaluationSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
