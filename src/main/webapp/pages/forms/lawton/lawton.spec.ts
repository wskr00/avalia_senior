import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Lawton } from './lawton';
import { EvaluationForm } from '@/components/evaluation-form/evaluation-form';
import { HeaderService } from '@/services/header';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { signal, Component, input } from '@angular/core';
import { provideRouter } from '@angular/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';

@Component({
  selector: 'app-evaluation-form',
  standalone: true,
  template: '<div>Mock Evaluation Form</div>',
})
class MockEvaluationForm {
  config = input<any>();
  questions = input<any[]>();
}

describe('Lawton (Componente)', () => {
  let component: Lawton;
  let fixture: ComponentFixture<Lawton>;
  let headerService: HeaderService;

  beforeEach(async () => {
    const headerServiceMock = {
      setTitle: vi.fn(),
      setShowBackButton: vi.fn(),
      title: signal('Escala de Lawton'),
      showBackButton: signal(true),
    };

    await TestBed.configureTestingModule({
      imports: [Lawton],
      providers: [
        provideRouter([]),
        { provide: HeaderService, useValue: headerServiceMock },
        providePrimeNG({ theme: { preset: Aura } }),
      ],
    })
      .overrideComponent(Lawton, {
        remove: { imports: [EvaluationForm] },
        add: { imports: [MockEvaluationForm] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Lawton);
    component = fixture.componentInstance;
    headerService = TestBed.inject(HeaderService);

    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('deve ser criado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve configurar o título correto no HeaderService ao iniciar', () => {
    expect(headerService.setTitle).toHaveBeenCalledWith('Escala de Lawton');
  });

  it('deve conter a configuração inicial correta da escala de Lawton', () => {
    const config = component['lawton_config']();
    expect(config.id).toBe('lawton');
    expect(config.baseline).toBe(27);
  });

  it('deve passar a configuração e as perguntas para o app-evaluation-form', () => {
    const evaluationFormEl = fixture.debugElement.query(By.directive(MockEvaluationForm));
    const childInstance = evaluationFormEl.componentInstance;

    expect(childInstance.config()).toEqual(component['lawton_config']());
    expect(childInstance.questions()).toEqual(component['lawton_questions']());
  });

  it('deve garantir que todas as perguntas tenham 3 opções de resposta e valores corretos', () => {
    const questions = component['lawton_questions']();
    questions.forEach((question) => {
      expect(question.options.length).toBe(3);
      expect(question.options[0].value).toBe(0);
      expect(question.options[1].value).toBe(-1);
      expect(question.options[2].value).toBe(-2);
    });
  });
});
