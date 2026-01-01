import { EvaluationForm } from '@/components/evaluation-form/evaluation-form';
import { EvaluationQuestion, ScaleDefinition } from '@/interfaces/evaluation';
import { HeaderService } from '@/services/header';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';

@Component({
  selector: 'app-tinetti',
  imports: [EvaluationForm],
  templateUrl: './tinetti.html',
  styleUrl: './tinetti.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tinetti implements OnInit {
  private headerService = inject(HeaderService);

  protected tinetti_config = signal<ScaleDefinition>({
    id: 'tinetti',
    baseline: 28,
    ranges: [
      { min: 0, max: 19, label: '5 vezes mais risco de quedas' },
      { min: 20, max: 28, label: 'Normal' },
    ],
  });

  protected tinetti_questions = signal<EvaluationQuestion[]>([
    {
      title: '1. Equilíbrio sentado',
      options: [
        { label: 'Escorrega', value: 0 },
        { label: 'Equilíbrio', value: -1 },
      ],
    },
    {
      title: '2. Levantando',
      options: [
        { label: 'Incapaz', value: 0 },
        { label: 'Usa os braços', value: -1 },
        { label: 'Sem os braços', value: -2 },
      ],
    },
    {
      title: '3. Tentativas de levantar',
      options: [
        { label: 'Incapaz', value: 0 },
        { label: 'Mais de uma tentativa', value: -1 },
        { label: 'Única tentativa', value: -2 },
      ],
    },
    {
      title: '4. Assim que levanta (primeiros 5 segundos)',
      options: [
        { label: 'Desequilibrado', value: 0 },
        { label: 'Estável, mas usa suporte', value: -1 },
        { label: 'Estável, sem suporte', value: -2 },
      ],
    },
    {
      title: '5. Equilíbrio em pé',
      options: [
        { label: 'Desequilibrado', value: 0 },
        { label: 'Suporte ou base > 12cm', value: -1 },
        { label: 'Sem suporte e base estreita', value: -2 },
      ],
    },
    {
      title: '6. Teste dos três tempos (pés juntos)',
      options: [
        { label: 'Começa a cair', value: 0 },
        { label: 'Agarra ou balança os braços', value: -1 },
        { label: 'Equilibrado', value: -2 },
      ],
    },
    {
      title: '7. Olhos fechados (pés juntos)',
      options: [
        { label: 'Desequilíbrio ou instável', value: 0 },
        { label: 'Equilibrado', value: -1 },
      ],
    },
    {
      title: '8. Girando 360º',
      options: [
        { label: 'Passos descontínuos', value: 0 },
        { label: 'Instável', value: -1 },
        { label: 'Estável', value: -2 },
      ],
    },
    {
      title: '9. Sentando',
      options: [
        { label: 'Inseguro', value: 0 },
        { label: 'Usa braços ou realiza movimentos bruscos', value: -1 },
        { label: 'Seguro, movimentação suave', value: -2 },
      ],
    },
    {
      title: '10. Iniciação da marcha',
      options: [
        {
          label:
            'Imediatamente após dizer o comando "vá", qualquer hesitação ou múltiplas tentativas para iniciar',
          value: 0,
        },
        { label: 'Sem hesitação', value: -1 },
      ],
    },

    {
      groupTitle: '11. Comprimento e altura do passo',
      title: 'a) Comprimento da perna direita',
      options: [
        { label: 'Não passa o membro esquerdo', value: 0 },
        { label: 'Passa o membro esquerdo', value: -1 },
      ],
    },
    {
      groupTitle: '11. Comprimento e altura do passo',
      title: 'b) Altura do passo da perna direita',
      options: [
        { label: 'Pé não sai completamente do solo', value: 0 },
        { label: 'Pé sai completamente do solo', value: -1 },
      ],
    },
    {
      groupTitle: '11. Comprimento e altura do passo',
      title: 'c) Comprimento da perna esquerda',
      options: [
        { label: 'Não passa o membro direito', value: 0 },
        { label: 'Passa o membro direito', value: -1 },
      ],
    },
    {
      groupTitle: '11. Comprimento e altura do passo',
      title: 'd) Altura do passo da perna esquerda',
      options: [
        { label: 'Pé não sai completamente do solo', value: 0 },
        { label: 'Pé sai completamente do solo', value: -1 },
      ],
    },
    {
      title: '12. Simetria do passo',
      options: [
        { label: 'Passos desiguais', value: 0 },
        { label: 'Passos iguais', value: -1 },
      ],
    },
    {
      title: '13. Continuidade do passo',
      options: [
        { label: 'Paradas ou descontinuidade', value: 0 },
        { label: 'Passos contínuos', value: -1 },
      ],
    },
    {
      title:
        '14. Desvio da linha reta (distância estimada em, aproximadamente, 3m de comprimento por 30cm de largura)',
      options: [
        { label: 'Desvio marcado', value: 0 },
        { label: 'Leve/moderado ou usa auxílio', value: -1 },
        { label: 'Linha reta sem auxílio', value: -2 },
      ],
    },
    {
      title: '15. Tronco',
      options: [
        { label: 'Oscilação marcada ou usa auxílio', value: 0 },
        {
          label:
            'Sem oscilação, mas com flexão dos joelhos ou dor lombar, ou afasta os braços enquanto anda',
          value: -1,
        },
        {
          label:
            'Sem oscilação, sem flexão, sem uso dos braços e sem uso de dispositivo de auxílio à marcha',
          value: -2,
        },
      ],
    },
    {
      title: '16. Base de apoio',
      options: [
        { label: 'Calcanhares afastados', value: 0 },
        { label: 'Calcanhares quase se tocando', value: -1 },
      ],
    },
  ]);

  ngOnInit(): void {
    this.headerService.setTitle('Avaliação de Equilibrio e Marcha de Tinetti');
  }
}
