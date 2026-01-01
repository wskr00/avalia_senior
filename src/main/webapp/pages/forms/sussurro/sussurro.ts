import { EvaluationForm } from '@/components/evaluation-form/evaluation-form';
import { EvaluationQuestion, ScaleDefinition } from '@/interfaces/evaluation';
import { HeaderService } from '@/services/header';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';

@Component({
  selector: 'app-sussurro',
  imports: [EvaluationForm],
  templateUrl: './sussurro.html',
  styleUrl: './sussurro.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sussurro implements OnInit {
  private headerService = inject(HeaderService);

  protected sussurro_config = signal<ScaleDefinition>({
    id: 'sussurro',
    baseline: 0,
    ranges: [
      { min: 0, label: 'Negativo para diminuição de acuidade auditiva' },
      { min: 1, label: 'Positivo para diminuição de acuidade auditiva' },
    ],
  });

  protected sussurro_questions = signal<EvaluationQuestion[]>([
    {
      title:
        'O avaliador deve ficar fora do campo visual da pessoa idosa, a uma distância de aproximadamente 33cm e sussurrar uma frase em cada ouvido do paciente.',
      options: [
        { label: 'Paciente respondeu ou ouviu', value: 0 },
        { label: 'Paciente não respondeu ou não ouviu', value: 1 },
      ],
    },
  ]);

  ngOnInit(): void {
    this.headerService.setTitle('Teste do Sussurro');
  }
}
