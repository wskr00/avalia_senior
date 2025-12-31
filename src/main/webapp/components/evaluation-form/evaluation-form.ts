import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';

import {
  EvaluationQuestion,
  EvaluationResult as IEvaluationResult,
  ScaleDefinition,
  QuestionOption,
} from '@/interfaces/evaluation';
import { EvaluationCalculatorService } from '@/services/evaluation-calculator';
import { EvaluationFormService } from '@/services/evaluation-form';
import { HeaderService } from '@/services/header';
import { BasicInfo } from './basic-info/basic-info';
import { EvaluationResult } from './evaluation-result/evaluation-result';
import { SubmitButton } from './submit-button/submit-button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-evaluation-form',
  imports: [
    ReactiveFormsModule,
    CardModule,
    RadioButtonModule,
    BasicInfo,
    SubmitButton,
    EvaluationResult,
    RippleModule,
  ],
  templateUrl: './evaluation-form.html',
  styleUrl: './evaluation-form.scss',
  providers: [EvaluationFormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationForm implements OnInit {
  protected evaluationFormService = inject(EvaluationFormService);
  private calculatorService = inject(EvaluationCalculatorService);
  private headerService = inject(HeaderService);

  config = input.required<ScaleDefinition>();
  questions = input.required<EvaluationQuestion[]>();

  protected showResult = signal(false);
  protected calculationResult = signal<IEvaluationResult | undefined>(undefined);
  protected evaluationTitle = computed(() => this.headerService.title());

  constructor() {
    effect(() => {
      this.evaluationFormService.setScaleConfig(this.config());

      if (this.questions().length > 0) {
        this.evaluationFormService.initializeResponses(this.questions().length);
      }
    });
  }

  ngOnInit(): void {
    this.headerService.setShowBackButton(true);
  }

  onSubmit(): void {
    const form = this.evaluationFormService.form;

    if (form.valid) {
      const rawResponses = form.getRawValue().responses as QuestionOption[];
      const numericResponses = rawResponses.map((option) => option.value);

      const result = this.calculatorService.calculate(this.config(), numericResponses);

      this.calculationResult.set(result);
      this.showResult.set(true);
    } else {
      form.markAllAsTouched();
    }
  }
}
