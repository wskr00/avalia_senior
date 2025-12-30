import { Injectable } from '@angular/core';
import { ScaleDefinition, EvaluationResult } from '@/interfaces/evaluation';

@Injectable({
  providedIn: 'root',
})
export class EvaluationCalculatorService {
  calculate(config: ScaleDefinition, responses: number[]): EvaluationResult {
    const sum = responses.reduce((acc, curr) => acc + (Number(curr) || 0), 0);

    const totalScore = config.baseline + sum;

    const range = config.ranges.find((r) => totalScore >= r.min && totalScore <= r.max);

    return {
      score: totalScore,
      interpretation: range ? range.label : 'Resultado fora da faixa de referência',
    };
  }
}
