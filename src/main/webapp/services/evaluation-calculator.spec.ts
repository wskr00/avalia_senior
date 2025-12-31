import { TestBed } from '@angular/core/testing';
import { EvaluationCalculatorService } from './evaluation-calculator';
import { ScaleDefinition } from '@/interfaces/evaluation';
import { describe, it, expect, beforeEach } from 'vitest';

describe('EvaluationCalculatorService', () => {
  let service: EvaluationCalculatorService;

  const mockConfig: ScaleDefinition = {
    id: 'test-scale',
    baseline: 27,
    ranges: [
      { min: 0, max: 10, label: 'Dependente' },
      { min: 11, max: 20, label: 'Parcial' },
      { min: 21, max: 27, label: 'Independente' },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EvaluationCalculatorService],
    });
    service = TestBed.inject(EvaluationCalculatorService);
  });

  it('deve ser criado com sucesso', () => {
    expect(service).toBeTruthy();
  });

  it('deve calcular a soma corretamente com valores negativos (Caso Lawton)', () => {
    const responses = [-2, -1, 0];
    const result = service.calculate(mockConfig, responses);

    expect(result.score).toBe(24);
    expect(result.interpretation).toBe('Independente');
  });

  it('deve converter strings numéricas e calcular corretamente (Resiliência)', () => {
    const responses = ['-5', '2'] as any;
    const result = service.calculate(mockConfig, responses);

    expect(result.score).toBe(24);
  });

  it('deve classificar corretamente nos limites exatos das faixas (Boundary)', () => {
    const result10 = service.calculate(mockConfig, [-17]);
    expect(result10.interpretation).toBe('Dependente');

    const result11 = service.calculate(mockConfig, [-16]);
    expect(result11.interpretation).toBe('Parcial');

    const result21 = service.calculate(mockConfig, [-6]);
    expect(result21.interpretation).toBe('Independente');
  });

  it('deve tratar null ou undefined como 0 e não quebrar o cálculo', () => {
    const responses = [null, undefined, -5] as any;
    const result = service.calculate(mockConfig, responses);

    expect(result.score).toBe(22);
    expect(isNaN(result.score)).toBe(false);
  });

  it('deve retornar mensagem padrão quando o resultado está fora de qualquer faixa', () => {
    const outOfBoundsConfig: ScaleDefinition = {
      id: 'small-scale',
      baseline: 0,
      ranges: [{ min: 0, max: 5, label: 'Baixo' }],
    };

    const result = service.calculate(outOfBoundsConfig, [10]);
    expect(result.interpretation).toBe('Resultado fora da faixa de referência');
  });

  it('deve lidar com array de respostas vazio usando apenas o baseline', () => {
    const result = service.calculate(mockConfig, []);
    expect(result.score).toBe(27);
    expect(result.interpretation).toBe('Independente');
  });
});
