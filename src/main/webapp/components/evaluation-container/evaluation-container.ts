import { Component, OnInit, inject, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';

import { BasicInfo } from './basic-info/basic-info';
import { SubmitButton } from './submit-button/submit-button';
import { EvaluationResult } from './evaluation-result/evaluation-result';
import { EvaluationFormService } from '@/services/evaluation-form';
import { EvaluationCalculatorService } from '@/services/evaluation-calculator';
import { ScaleDefinition, EvaluationResult as IEvaluationResult } from '@/interfaces/evaluation';

@Component({
  selector: 'app-evaluation-container',
  imports: [ReactiveFormsModule, CardModule, BasicInfo, SubmitButton, EvaluationResult],
  templateUrl: './evaluation-container.html',
  styleUrl: './evaluation-container.scss',
  providers: [EvaluationFormService],
})
export class EvaluationContainer implements OnInit {
  protected evaluationFormService = inject(EvaluationFormService);
  private calculatorService = inject(EvaluationCalculatorService);

  @Input({ required: true }) config!: ScaleDefinition;

  protected showResult = false;
  protected calculationResult?: IEvaluationResult;

  ngOnInit(): void {
    this.evaluationFormService.setScaleConfig(this.config);
  }

  onSubmit(): void {
    const form = this.evaluationFormService.form;

    if (form.valid) {
      const responses = form.value.responses;

      this.calculationResult = this.calculatorService.calculate(this.config, responses);
      this.showResult = true;

      console.log('Avaliação Finalizada:', {
        paciente: form.value.basicInfo.patientName,
        resultado: this.calculationResult,
      });
    } else {
      form.markAllAsTouched();
    }
  }
}
