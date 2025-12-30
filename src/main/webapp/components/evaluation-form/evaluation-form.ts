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
import { RadioButtonModule } from 'primeng/radiobutton'; // Importado para a lógica integrada

import {
  EvaluationQuestion,
  EvaluationResult as IEvaluationResult,
  ScaleDefinition,
} from '@/interfaces/evaluation';
import { EvaluationCalculatorService } from '@/services/evaluation-calculator';
import { EvaluationFormService } from '@/services/evaluation-form';
import { HeaderService } from '@/services/header';
import { BasicInfo } from './basic-info/basic-info';
import { EvaluationResult } from './evaluation-result/evaluation-result';
import { SubmitButton } from './submit-button/submit-button';

@Component({
  selector: 'app-evaluation-form',
  imports: [
    ReactiveFormsModule,
    CardModule,
    RadioButtonModule, // Adicionado
    BasicInfo,
    SubmitButton,
    EvaluationResult,
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
  // Novo: Array de perguntas que dita a estrutura do formulário
  questions = input.required<EvaluationQuestion[]>();

  protected showResult = signal(false);
  protected calculationResult = signal<IEvaluationResult | undefined>(undefined);
  protected evaluationTitle = computed(() => this.headerService.title());

  constructor() {
    effect(() => {
      this.evaluationFormService.setScaleConfig(this.config());

      // Inicializa todo o array de uma vez, evitando o lag de registros individuais
      if (this.questions().length > 0) {
        this.evaluationFormService.initializeResponses(this.questions().length);
      }
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    const form = this.evaluationFormService.form;

    if (form.valid) {
      const responses = form.getRawValue().responses;
      const result = this.calculatorService.calculate(this.config(), responses);

      this.calculationResult.set(result);
      this.showResult.set(true);
    } else {
      form.markAllAsTouched();
    }
  }
}
