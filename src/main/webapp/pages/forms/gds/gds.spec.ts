import { EvaluationForm } from '@/components/evaluation-form/evaluation-form';
import { HeaderService } from '@/services/header';
import { Component, input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Gds } from './gds';

@Component({
  selector: 'app-evaluation-form',
  template: '<div>Mock Evaluation Form</div>',
})
class MockEvaluationForm {
  config = input<any>();
  questions = input<any[]>();
}

describe('Gds (Componente)', () => {
  let component: Gds;
  let fixture: ComponentFixture<Gds>;
  let headerService: HeaderService;

  beforeEach(async () => {
    const headerServiceMock = {
      setTitle: vi.fn(),
      setShowBackButton: vi.fn(),
      title: signal('Escala de Depressão Geriátrica'),
      showBackButton: signal(true),
    };

    await TestBed.configureTestingModule({
      imports: [Gds],
      providers: [
        provideRouter([]),
        { provide: HeaderService, useValue: headerServiceMock },
        providePrimeNG({ theme: { preset: Aura } }),
      ],
    })
      .overrideComponent(Gds, {
        remove: { imports: [EvaluationForm] },
        add: { imports: [MockEvaluationForm] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Gds);
    component = fixture.componentInstance;
    headerService = TestBed.inject(HeaderService);

    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('deve ser criado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve configurar o título correto no HeaderService ao iniciar', () => {
    expect(headerService.setTitle).toHaveBeenCalledWith('Escala de Depressão Geriátrica');
  });

  it('deve conter a configuração inicial correta da escala GDS', () => {
    const config = component['gds_config']();
    expect(config.id).toBe('gds');
    expect(config.baseline).toBe(0);
    expect(config.ranges.length).toBe(3);
  });

  it('deve passar a configuração e as perguntas para o app-evaluation-form', () => {
    const evaluationFormEl = fixture.debugElement.query(By.directive(MockEvaluationForm));
    const childInstance = evaluationFormEl.componentInstance;

    expect(childInstance.config()).toEqual(component['gds_config']());
    expect(childInstance.questions()).toEqual(component['gds_questions']());
  });

  it('deve garantir que existam 15 perguntas com 2 opções cada e valores corretos', () => {
    const questions = component['gds_questions']();
    expect(questions.length).toBe(15);

    questions.forEach((q) => {
      expect(q.options.length).toBe(2);
      expect([0, 1]).toContain(q.options[0].value);
      expect([0, 1]).toContain(q.options[1].value);
    });
  });

  it('deve validar as questões invertidas corretamente', () => {
    const questions = component['gds_questions']();

    const invertedIndexes = [0, 4, 6, 10, 12];

    invertedIndexes.forEach((index) => {
      const q = questions[index];
      expect(q.options[0].value).toBe(0);
      expect(q.options[1].value).toBe(1);
    });
  });
});
