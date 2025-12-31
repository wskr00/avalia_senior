import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EvaluationForm } from '@/components/evaluation-form/evaluation-form';
import { EvaluationFormService } from '@/services/evaluation-form';
import { EvaluationCalculatorService } from '@/services/evaluation-calculator';
import { HeaderService } from '@/services/header';
import { ReactiveFormsModule } from '@angular/forms';
import { signal, Component, input, output, model } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { CardModule } from 'primeng/card';
import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { ScaleDefinition, EvaluationQuestion } from '@/interfaces/evaluation';

// 1. Importações do CDK para Harnesses
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader, ComponentHarness } from '@angular/cdk/testing';

// 2. Harnesses para os Mocks (Abstração da Interface)
class SubmitButtonHarness extends ComponentHarness {
  static hostSelector = 'app-submit-button';
  async click() {
    // Simula o clique disparando o output de evento
    const host = await this.host();
    await host.dispatchEvent('onClick');
  }
}

class EvaluationResultHarness extends ComponentHarness {
  static hostSelector = 'app-evaluation-result';
  async isVisible() {
    // Como visible é um model/signal no mock, verificamos o estado no componente
    // Em um teste real de harness, leríamos o DOM do modal
    const host = await this.host();
    return (await host.getAttribute('ng-reflect-visible')) === 'true';
  }
}

// Mocks (Stubs)
@Component({ selector: 'app-basic-info', standalone: true, template: '' })
class MockBasicInfo {}

@Component({
  selector: 'app-evaluation-result',
  standalone: true,
  template: '<div [attr.ng-reflect-visible]="visible()"></div>',
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
  template: '<button (click)="onClick.emit()"></button>',
})
class MockSubmitButton {
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  onClick = output<void>();
}

describe('EvaluationForm', () => {
  let component: EvaluationForm;
  let fixture: ComponentFixture<EvaluationForm>;
  let formService: EvaluationFormService;
  let calculatorService: EvaluationCalculatorService;
  let loader: HarnessLoader;

  const mockConfig: ScaleDefinition = {
    id: 'lawton',
    baseline: 27,
    ranges: [{ min: 0, max: 27, label: 'Teste' }],
  };

  const mockQuestions: EvaluationQuestion[] = [
    { title: 'Pergunta 1', options: [{ label: 'Opt 1', value: 0 }] },
  ];

  beforeAll(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })
    );
  });

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
        { provide: EvaluationCalculatorService, useValue: calculatorMock },
        { provide: HeaderService, useValue: headerMock },
        providePrimeNG({ theme: { preset: Aura } }),
      ],
    })
      .overrideComponent(EvaluationForm, {
        add: { imports: [MockBasicInfo, MockEvaluationResult, MockSubmitButton] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(EvaluationForm);
    component = fixture.componentInstance;

    calculatorService = TestBed.inject(EvaluationCalculatorService);
    formService = fixture.debugElement.injector.get(EvaluationFormService);
    loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.componentRef.setInput('config', mockConfig);
    fixture.componentRef.setInput('questions', mockQuestions);

    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('deve calcular o resultado e abrir o modal quando o formulário for válido', async () => {
    const expectedResult = { score: 25, interpretation: 'Independente' };
    vi.mocked(calculatorService.calculate).mockReturnValue(expectedResult);

    // Setup do estado do formulário
    formService.initializeResponses(1);
    formService.patchBasicInfo({
      doctorName: 'Dr House',
      patientName: 'Wilson',
      age: 45,
      date: new Date(),
    });
    formService.responses.at(0).setValue(0);

    // Ação: Interagir com o botão via Harness em vez de chamar component.onSubmit()
    const submitBtn = await loader.getHarness(SubmitButtonHarness);
    await submitBtn.click();

    // Verificação de lógica
    expect(calculatorService.calculate).toHaveBeenCalled();

    // Verificação de UI via Harness do Modal
    const resultModal = await loader.getHarness(EvaluationResultHarness);
    expect(await resultModal.isVisible()).toBe(true);
  });

  it('deve atualizar o título do modal quando o HeaderService mudar', async () => {
    const resultEl = fixture.debugElement.query(By.directive(MockEvaluationResult));
    const resultInstance = resultEl.componentInstance;

    expect(resultInstance.title()).toBe('Título Teste');
  });

  it('deve reinicializar o formulário ao detectar novas questões', async () => {
    const spyInit = vi.spyOn(formService, 'initializeResponses');
    const novasQuestoes = [...mockQuestions, { title: 'Q2', options: [] }];

    fixture.componentRef.setInput('questions', novasQuestoes);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(spyInit).toHaveBeenCalledWith(2);
  });
});
