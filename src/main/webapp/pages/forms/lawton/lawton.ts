import { Component, OnInit, inject } from '@angular/core';
import { EvaluationContainer } from '@/components/evaluation-container/evaluation-container';
import { EvaluationOption } from '@/components/evaluation-container/evaluation-section/evaluation-option/evaluation-option';
import { EvaluationSection } from '@/components/evaluation-container/evaluation-section/evaluation-section';
import { HeaderService } from '@/services/header';
import { ScaleDefinition } from '@/interfaces/evaluation';

@Component({
  selector: 'app-lawton',
  imports: [EvaluationContainer, EvaluationSection, EvaluationOption],
  templateUrl: './lawton.html',
  styleUrl: './lawton.scss',
})
export class Lawton implements OnInit {
  private headerService = inject(HeaderService);

  protected readonly LAWTON_CONFIG: ScaleDefinition = {
    id: 'lawton',
    baseline: 27,
    ranges: [
      { min: 0, max: 9, label: 'Totalmente dependente' },
      { min: 10, max: 15, label: 'Dependência grave' },
      { min: 16, max: 20, label: 'Dependência moderada' },
      { min: 21, max: 25, label: 'Dependência leve' },
      { min: 26, max: 27, label: 'Independente' },
    ],
  };

  ngOnInit(): void {
    this.headerService.setTitle('Escala de Lawton');
  }
}
