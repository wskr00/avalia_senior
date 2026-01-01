import { EvaluationForm } from '@/components/evaluation-form/evaluation-form';
import { HeaderService } from '@/services/header';
import { Component, input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Meem } from './meem';

@Component({
  selector: 'app-evaluation-form',
  template: '<div>Mock Evaluation Form</div>',
})
class MockEvaluationForm {
  config = input<any>();
  questions = input<any[]>();
}

describe('Meem (Componente)', () => {
  let component: Meem;
  let fixture: ComponentFixture<Meem>;
  let headerService: HeaderService;

  beforeEach(async () => {
    const headerServiceMock = {
      setTitle: vi.fn(),
      setShowBackButton: vi.fn(),
      title: signal('Mini Exame do Estado Mental'),
      showBackButton: signal(true),
    };

    await TestBed.configureTestingModule({
      imports: [Meem],
      providers: [
        provideRouter([]),
        { provide: HeaderService, useValue: headerServiceMock },
        providePrimeNG({ theme: { preset: Aura } }),
      ],
    })
      .overrideComponent(Meem, {
        remove: { imports: [EvaluationForm] },
        add: { imports: [MockEvaluationForm] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Meem);
    component = fixture.componentInstance;
    headerService = TestBed.inject(HeaderService);

    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('deve ser criado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve configurar o título correto no HeaderService ao iniciar', () => {
    expect(headerService.setTitle).toHaveBeenCalledWith('Mini Exame do Estado Mental');
  });

  it('deve conter a configuração inicial correta da escala de meem', () => {
    const config = component['meem_config']();
    expect(config.id).toBe('meem');
    expect(config.baseline).toBe(30);
  });

  it('deve passar a configuração e as perguntas para o app-evaluation-form', () => {
    const evaluationFormEl = fixture.debugElement.query(By.directive(MockEvaluationForm));
    const childInstance = evaluationFormEl.componentInstance;

    expect(childInstance.config()).toEqual(component['meem_config']());
    expect(childInstance.questions()).toEqual(component['meem_questions']());
  });

  it('deve garantir que todas as perguntas tenham opções de resposta e valores coerentes', () => {
    const questions = component['meem_questions']();
    expect(questions.length).toBeGreaterThan(0);

    questions.forEach((question) => {
      // Valida que existem opções (ajuste os valores esperados conforme a lógica da escala)
      expect(question.options.length).toBeGreaterThan(0);
      expect(question.options[0]).toHaveProperty('value');
    });
  });
});
