import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvaluationForm } from './evaluation-form';
import { EvaluationFormService as FormService } from '@/services/evaluation-form';
import { EvaluationCalculatorService } from '@/services/evaluation-calculator';
import { HeaderService } from '@/services/header';
import { ReactiveFormsModule } from '@angular/forms';
import { signal, Component, input, output, model } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { CardModule } from 'primeng/card';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ScaleDefinition, EvaluationQuestion, QuestionOption } from '@/interfaces/evaluation';

import { BasicInfo } from './basic-info/basic-info';
import { EvaluationResult } from './evaluation-result/evaluation-result';
import { SubmitButton } from './submit-button/submit-button';

import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader, ComponentHarness } from '@angular/cdk/testing';

class SubmitButtonHarness extends ComponentHarness {
  static hostSelector = 'app-submit-button';

  async click() {
    const button = await this.locatorFor('button')();
    await button.click();
  }
}

class EvaluationResultHarness extends ComponentHarness {
  static hostSelector = 'app-evaluation-result';

  async isVisible() {
    const host = await this.host();
    return (await host.getAttribute('data-test-visible')) === 'true';
  }
}

@Component({ selector: 'app-basic-info', standalone: true, template: '' })
class MockBasicInfo {}

@Component({
  selector: 'app-evaluation-result',
  standalone: true,
  template: '',
  host: {
    '[attr.data-test-visible]': 'visible()',
  },
})
class MockEvaluationResult {
  title = input<string>();
  result = input<any>();
  config = input<any>();
  formValues = input<any>();
  visible = model<boolean>(false);
}

@Component({
  selector: 'app-submit-button',
  standalone: true,
  template: '<button (click)="onClick.emit()">Enviar</button>',
})
class MockSubmitButton {
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  onClick = output<void>();
}

describe('EvaluationForm (Componente)', () => {
  let component: EvaluationForm;
  let fixture: ComponentFixture<EvaluationForm>;
  let formService: FormService;
  let calculatorService: EvaluationCalculatorService;
  let loader: HarnessLoader;

  const mockConfig: ScaleDefinition = {
    id: 'lawton',
    baseline: 27,
    ranges: [{ min: 0, max: 27, label: 'Teste' }],
  };

  const mockQuestions: EvaluationQuestion[] = [
    {
      title: 'Pergunta 1',
      options: [{ label: 'Opção Zero', value: 0 }],
    },
  ];

  beforeEach(async () => {
    const calculatorMock = { calculate: vi.fn() };
    const headerMock = {
      setShowBackButton: vi.fn(),
      setTitle: vi.fn(),
      title: signal('Título Teste'),
      showBackButton: signal(true),
    };

    await TestBed.configureTestingModule({
      imports: [EvaluationForm, ReactiveFormsModule, CardModule],
      providers: [
        FormService,
        { provide: EvaluationCalculatorService, useValue: calculatorMock },
        { provide: HeaderService, useValue: headerMock },
        providePrimeNG({ theme: { preset: Aura } }),
      ],
    })
      .overrideComponent(EvaluationForm, {
        remove: {
          imports: [BasicInfo, EvaluationResult, SubmitButton],
          providers: [FormService],
        },
        add: {
          imports: [MockBasicInfo, MockEvaluationResult, MockSubmitButton],
        },
      })
      .compileComponents();

    formService = TestBed.inject(FormService);
    calculatorService = TestBed.inject(EvaluationCalculatorService);

    fixture = TestBed.createComponent(EvaluationForm);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.componentRef.setInput('config', mockConfig);
    fixture.componentRef.setInput('questions', mockQuestions);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('deve ser criado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve calcular o resultado e abrir o modal quando o formulário for válido', async () => {
    const expectedResult = { score: 25, interpretation: 'Independente' };
    vi.mocked(calculatorService.calculate).mockReturnValue(expectedResult);

    formService.initializeResponses(1);
    formService.patchBasicInfo({
      doctorName: 'Dr House',
      patientName: 'Wilson',
      age: 45,
      date: new Date(),
    });

    const selectedOption: QuestionOption = mockQuestions[0].options[0];
    formService.responses.at(0).setValue(selectedOption);

    fixture.detectChanges();

    const submitBtn = await loader.getHarness(SubmitButtonHarness);
    await submitBtn.click();

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(calculatorService.calculate).toHaveBeenCalledWith(mockConfig, [0]);

    const resultModal = await loader.getHarness(EvaluationResultHarness);
    expect(await resultModal.isVisible()).toBe(true);
  });

  it('deve reinicializar o formulário ao detectar novas questões via input (Signal)', async () => {
    const spyInit = vi.spyOn(formService, 'initializeResponses');

    const novasQuestoes = [
      { title: 'Pergunta 1', options: [] },
      { title: 'Pergunta 2', options: [] },
    ];

    fixture.componentRef.setInput('questions', novasQuestoes);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(spyInit).toHaveBeenCalledWith(2);
  });
});
