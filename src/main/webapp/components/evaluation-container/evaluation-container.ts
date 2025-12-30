import {
  Component,
  inject,
  input,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  computed,
  effect,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';

import { EvaluationResult as IEvaluationResult, ScaleDefinition } from '@/interfaces/evaluation';
import { EvaluationCalculatorService } from '@/services/evaluation-calculator';
import { EvaluationFormService } from '@/services/evaluation-form';
import { HeaderService } from '@/services/header';
import { BasicInfo } from './basic-info/basic-info';
import { EvaluationResult } from './evaluation-result/evaluation-result';
import { SubmitButton } from './submit-button/submit-button';

@Component({
  selector: 'app-evaluation-container',
  imports: [ReactiveFormsModule, CardModule, BasicInfo, SubmitButton, EvaluationResult],
  templateUrl: './evaluation-container.html',
  styleUrl: './evaluation-container.scss',
  providers: [EvaluationFormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationContainer implements OnInit {
  protected evaluationFormService = inject(EvaluationFormService);
  private calculatorService = inject(EvaluationCalculatorService);
  private headerService = inject(HeaderService);

  config = input.required<ScaleDefinition>();

  protected showResult = signal(false);
  protected calculationResult = signal<IEvaluationResult | undefined>(undefined);

  protected evaluationTitle = computed(() => this.headerService.title());

  constructor() {
    effect(() => {
      this.evaluationFormService.setScaleConfig(this.config());
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    const form = this.evaluationFormService.form;

    if (form.valid) {
      const responses = form.value.responses;
      const result = this.calculatorService.calculate(this.config(), responses);

      this.calculationResult.set(result);
      this.showResult.set(true);

      console.log('Avaliação Finalizada:', {
        paciente: form.value.basicInfo.patientName,
        resultado: result,
      });
    } else {
      form.markAllAsTouched();
    }
  }
}
