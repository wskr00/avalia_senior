import { EvaluationForm } from '@/components/evaluation-form/evaluation-form';
import { HeaderService } from '@/services/header';
import { Component, input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Katz } from './katz';

@Component({
  selector: 'app-evaluation-form',
  standalone: true,
  template: '<div>Mock Evaluation Form</div>',
})
class MockEvaluationForm {
  config = input<any>();
  questions = input<any[]>();
}

describe('Katz (Componente)', () => {
  let component: Katz;
  let fixture: ComponentFixture<Katz>;
  let headerService: HeaderService;

  beforeEach(async () => {
    const headerServiceMock = {
      setTitle: vi.fn(),
      setShowBackButton: vi.fn(),
      title: signal('Índice de Katz'),
      showBackButton: signal(true),
    };

    await TestBed.configureTestingModule({
      imports: [Katz],
      providers: [
        provideRouter([]),
        { provide: HeaderService, useValue: headerServiceMock },
        providePrimeNG({ theme: { preset: Aura } }),
      ],
    })
      .overrideComponent(Katz, {
        remove: { imports: [EvaluationForm] },
        add: { imports: [MockEvaluationForm] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Katz);
    component = fixture.componentInstance;
    headerService = TestBed.inject(HeaderService);

    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('deve ser criado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve configurar o título correto no HeaderService ao iniciar', () => {
    expect(headerService.setTitle).toHaveBeenCalledWith('Índice de Katz');
  });

  it('deve conter a configuração inicial correta da escala de Katz', () => {
    const config = component['katz_config']();
    expect(config.id).toBe('katz');
    expect(config.baseline).toBe(0);
  });

  it('deve passar a configuração e as perguntas para o app-evaluation-form', () => {
    const evaluationFormEl = fixture.debugElement.query(By.directive(MockEvaluationForm));
    const childInstance = evaluationFormEl.componentInstance;

    expect(childInstance.config()).toEqual(component['katz_config']());
    expect(childInstance.questions()).toEqual(component['katz_questions']());
  });

  it('deve garantir que todas as perguntas tenham 3 opções de resposta e valores corretos', () => {
    const questions = component['katz_questions']();
    expect(questions.length).toBe(6);

    questions.forEach((question) => {
      expect(question.options.length).toBe(3);
      // No Katz, as opções geralmente seguem o padrão: 0 (Independente), 0 (Com ajuda parcial/específica), 1 (Dependente)
      expect(question.options[0].value).toBe(0);
      expect(question.options[1].value).toBe(0);
      expect(question.options[2].value).toBe(1);
    });
  });
});
