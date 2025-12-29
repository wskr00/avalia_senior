import { Component, inject, Input, OnInit } from '@angular/core';
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
})
export class EvaluationContainer implements OnInit {
  protected evaluationFormService = inject(EvaluationFormService);
  private calculatorService = inject(EvaluationCalculatorService);
  private headerService = inject(HeaderService);

  @Input({ required: true }) config!: ScaleDefinition;

  protected showResult = false;
  protected calculationResult?: IEvaluationResult;
  protected evaluationTitle = '';

  ngOnInit(): void {
    this.evaluationFormService.setScaleConfig(this.config);
    this.evaluationTitle = this.headerService.title();
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
