import { EvaluationForm } from '@/components/evaluation-form/evaluation-form';
import { ScaleDefinition } from '@/interfaces/evaluation';
import { HeaderService } from '@/services/header';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { EvaluationQuestion } from '../../../interfaces/evaluation';

@Component({
  selector: 'app-lawton',
  imports: [EvaluationForm],
  templateUrl: './lawton.html',
  styleUrl: './lawton.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Lawton implements OnInit {
  private headerService = inject(HeaderService);

  protected lawton_config = signal<ScaleDefinition>({
    id: 'lawton',
    baseline: 27,
    ranges: [
      { min: 0, max: 9, label: 'Totalmente dependente' },
      { min: 10, max: 15, label: 'Dependência grave' },
      { min: 16, max: 20, label: 'Dependência moderada' },
      { min: 21, max: 25, label: 'Dependência leve' },
      { min: 26, max: 27, label: 'Independente' },
    ],
  });

  protected lawton_questions = signal<EvaluationQuestion[]>([
    {
      title: 'O(a) Sr(a) consegue usar o telefone?',
      options: [
        { label: 'Sem ajuda', value: 0 },
        { label: 'Com ajuda parcial', value: -1 },
        { label: 'Não consegue', value: -2 },
      ],
    },
    {
      title:
        'O(a) Sr(a) consegue ir a locais distantes, usando algum transporte, sem necessidade de planejamentos especiais?',
      options: [
        { label: 'Sem ajuda', value: 0 },
        { label: 'Com ajuda parcial', value: -1 },
        { label: 'Não consegue', value: -2 },
      ],
    },
    {
      title: 'O(a) Sr(a) consegue fazer compras?',
      options: [
        { label: 'Sem ajuda', value: 0 },
        { label: 'Com ajuda parcial', value: -1 },
        { label: 'Não consegue', value: -2 },
      ],
    },
    {
      title: 'O(a) Sr(a) consegue preparar suas próprias refeições?',
      options: [
        { label: 'Sem ajuda', value: 0 },
        { label: 'Com ajuda parcial', value: -1 },
        { label: 'Não consegue', value: -2 },
      ],
    },
    {
      title: 'O(a) Sr(a) consegue arrumar a casa?',
      options: [
        { label: 'Sem ajuda', value: 0 },
        { label: 'Com ajuda parcial', value: -1 },
        { label: 'Não consegue', value: -2 },
      ],
    },
    {
      title: 'O(a) Sr(a) consegue fazer trabalhos manuais domésticos, como pequenos reparos?',
      options: [
        { label: 'Sem ajuda', value: 0 },
        { label: 'Com ajuda parcial', value: -1 },
        { label: 'Não consegue', value: -2 },
      ],
    },
    {
      title: 'O(a) Sr(a) consegue lavar e passar sua roupa?',
      options: [
        { label: 'Sem ajuda', value: 0 },
        { label: 'Com ajuda parcial', value: -1 },
        { label: 'Não consegue', value: -2 },
      ],
    },
    {
      title: 'O(a) Sr(a) consegue tomar seus remédios na dose e horários corretos?',
      options: [
        { label: 'Sem ajuda', value: 0 },
        { label: 'Com ajuda parcial', value: -1 },
        { label: 'Não consegue', value: -2 },
      ],
    },
    {
      title: 'O(a) Sr(a) consegue cuidar de suas finanças?',
      options: [
        { label: 'Sem ajuda', value: 0 },
        { label: 'Com ajuda parcial', value: -1 },
        { label: 'Não consegue', value: -2 },
      ],
    },
  ]);

  ngOnInit(): void {
    this.headerService.setTitle('Escala de Lawton');
  }
}
