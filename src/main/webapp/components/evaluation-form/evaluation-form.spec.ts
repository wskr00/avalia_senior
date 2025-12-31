import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvaluationForm } from './evaluation-form';
import { EvaluationFormService } from '@/services/evaluation-form';
import { EvaluationCalculatorService } from '@/services/evaluation-calculator';
import { HeaderService } from '@/services/header';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ScaleDefinition, EvaluationQuestion } from '@/interfaces/evaluation';

describe('EvaluationForm', () => {
  let component: EvaluationForm;
  let fixture: ComponentFixture<EvaluationForm>;
  let formService: EvaluationFormService;
  let calculatorService: EvaluationCalculatorService;
  let headerService: HeaderService;

  const mockConfig: ScaleDefinition = {
    id: 'lawton',
    baseline: 27,
    ranges: [{ min: 0, max: 27, label: 'Teste' }],
  };

  const mockQuestions: EvaluationQuestion[] = [
    { title: 'Pergunta 1', options: [{ label: 'Opt 1', value: 0 }] },
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
      imports: [EvaluationForm, ReactiveFormsModule],
      providers: [
        { provide: EvaluationCalculatorService, useValue: calculatorMock },
        { provide: HeaderService, useValue: headerMock },
        providePrimeNG({ theme: { preset: Aura } }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(EvaluationForm);
    component = fixture.componentInstance;

    calculatorService = TestBed.inject(EvaluationCalculatorService);
    headerService = TestBed.inject(HeaderService);

    formService = fixture.debugElement.injector.get(EvaluationFormService);

    fixture.componentRef.setInput('config', mockConfig);
    fixture.componentRef.setInput('questions', mockQuestions);

    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('deve ser criado e configurar o cabeçalho no ngOnInit', () => {
    expect(component).toBeTruthy();
    expect(headerService.setShowBackButton).toHaveBeenCalledWith(true);
  });

  it('deve calcular o resultado e abrir o modal quando o formulário for válido', () => {
    const expectedResult = { score: 25, interpretation: 'Independente' };
    vi.mocked(calculatorService.calculate).mockReturnValue(expectedResult);

    formService.initializeResponses(1);
    formService.patchBasicInfo({
      doctorName: 'Dr House',
      patientName: 'Wilson',
      age: 45,
      date: new Date(),
    });
    formService.responses.at(0).setValue(0);

    component.onSubmit();

    expect(calculatorService.calculate).toHaveBeenCalledWith(mockConfig, [0]);
    expect(component['calculationResult']()).toEqual(expectedResult);
    expect(component['showResult']()).toBe(true);
  });

  it('deve marcar campos como tocados e NÃO calcular se o formulário for inválido', () => {
    const spyMarkAll = vi.spyOn(formService.form, 'markAllAsTouched');

    component.onSubmit();

    expect(calculatorService.calculate).not.toHaveBeenCalled();
    expect(spyMarkAll).toHaveBeenCalled();
    expect(component['showResult']()).toBe(false);
  });

  it('deve reinicializar o formulário quando as questões mudarem', async () => {
    const spyInit = vi.spyOn(formService, 'initializeResponses');

    const novasQuestoes = [...mockQuestions, { title: 'Q2', options: [] }];
    fixture.componentRef.setInput('questions', novasQuestoes);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(spyInit).toHaveBeenCalledWith(2);
  });

  it('deve computar o título da avaliação baseado no HeaderService', () => {
    expect(component['evaluationTitle']()).toBe('Título Teste');
  });
});
