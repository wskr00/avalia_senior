import { EvaluationForm } from '@/components/evaluation-form/evaluation-form';
import { EvaluationQuestion, ScaleDefinition } from '@/interfaces/evaluation';
import { HeaderService } from '@/services/header';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';

@Component({
  selector: 'app-gds',
  imports: [EvaluationForm],
  templateUrl: './gds.html',
  styleUrl: './gds.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Gds implements OnInit {
  private headerService = inject(HeaderService);

  protected gds_config = signal<ScaleDefinition>({
    id: 'gds',
    baseline: 0,
    ranges: [
      { min: 0, max: 5, label: 'Normal' },
      { min: 6, max: 10, label: 'Depressão leve' },
      { min: 11, max: 15, label: 'Dependência severa' },
    ],
  });

  protected gds_questions = signal<EvaluationQuestion[]>([
    {
      title: '1. Está satisfeito(a) com sua vida?',
      options: [
        { label: 'Sim', value: 0 },
        { label: 'Não', value: 1 },
      ],
    },
    {
      title: '2. Interrompeu muitas de suas atividades?',
      options: [
        { label: 'Sim', value: 1 },
        { label: 'Não', value: 0 },
      ],
    },
    {
      title: '3. Acha sua vida vazia?',
      options: [
        { label: 'Sim', value: 1 },
        { label: 'Não', value: 0 },
      ],
    },
    {
      title: '4. Aborrece-se com frequência?',
      options: [
        { label: 'Sim', value: 1 },
        { label: 'Não', value: 0 },
      ],
    },
    {
      title: '5. Sente-se bem com a vida na maior parte do tempo?',
      options: [
        { label: 'Sim', value: 0 },
        { label: 'Não', value: 1 },
      ],
    },
    {
      title: '6. Teme que algo ruim lhe aconteça?',
      options: [
        { label: 'Sim', value: 1 },
        { label: 'Não', value: 0 },
      ],
    },
    {
      title: '7. Sente-se alegre a maior parte do tempo?',
      options: [
        { label: 'Sim', value: 0 },
        { label: 'Não', value: 1 },
      ],
    },
    {
      title: '8. Sente-se desamparado com frequência?',
      options: [
        { label: 'Sim', value: 1 },
        { label: 'Não', value: 0 },
      ],
    },
    {
      title: '9. Prefere ficar em casa a sair e fazer coisas novas?',
      options: [
        { label: 'Sim', value: 1 },
        { label: 'Não', value: 0 },
      ],
    },
    {
      title: '10. Acha que tem mais problemas de memória que outras pessoas?',
      options: [
        { label: 'Sim', value: 1 },
        { label: 'Não', value: 0 },
      ],
    },
    {
      title: '11. Acha que é maravilhoso estar vivo(a)?',
      options: [
        { label: 'Sim', value: 0 },
        { label: 'Não', value: 1 },
      ],
    },
    {
      title: '12. Sente-se inútil?',
      options: [
        { label: 'Sim', value: 1 },
        { label: 'Não', value: 0 },
      ],
    },
    {
      title: '13. Sente-se cheio(a) de energia?',
      options: [
        { label: 'Sim', value: 0 },
        { label: 'Não', value: 1 },
      ],
    },
    {
      title: '14. Sente-se sem esperança?',
      options: [
        { label: 'Sim', value: 1 },
        { label: 'Não', value: 0 },
      ],
    },
    {
      title: '15. Acha que os outros têm mais sorte que você?',
      options: [
        { label: 'Sim', value: 1 },
        { label: 'Não', value: 0 },
      ],
    },
  ]);

  ngOnInit(): void {
    this.headerService.setTitle('Escala de Depressão Geriátrica');
  }
}
