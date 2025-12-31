import { EvaluationForm } from '@/components/evaluation-form/evaluation-form';
import { EvaluationQuestion, ScaleDefinition } from '@/interfaces/evaluation';
import { HeaderService } from '@/services/header';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';

@Component({
  selector: 'app-katz',
  imports: [EvaluationForm],
  templateUrl: './katz.html',
  styleUrl: './katz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Katz implements OnInit {
  private headerService = inject(HeaderService);

  protected katz_config = signal<ScaleDefinition>({
    id: 'katz',
    baseline: 0,
    ranges: [
      { min: 0, label: 'Independente' },
      { min: 1, label: 'Dependente para uma atividade' },
      { min: 2, label: 'Dependente para duas atividades' },
      { min: 3, label: 'Dependente para três atividades' },
      { min: 4, label: 'Dependente para quatro atividades' },
      { min: 5, label: 'Dependente para cinco atividades' },
      { min: 6, label: 'Dependente para seis atividades' },
    ],
  });

  protected katz_questions = signal<EvaluationQuestion[]>([
    {
      title: '1. Tomar banho (leito, banheira ou chuveiro).',
      options: [
        { label: 'Não recebe ajuda', value: 0 },
        {
          label:
            'Recebe ajuda para lavar apenas uma parte do corpo (exemplo, as costas ou uma pema)',
          value: 0,
        },
        {
          label: 'Recebe ajuda para lavar mais de uma parte do corpo, ou não toma banho sozinho ',
          value: 1,
        },
      ],
    },
    {
      title:
        '2. Vestir-se (pega roupa, inclusive peças íntimas, nos armários e gavetas, e manuseia fecho, inclusive os de órteses e próteses, quando forem utilizadas)',
      options: [
        { label: 'Pega as roupas e veste-se completamente, sem ajuda', value: 0 },
        {
          label: 'Pega as roupas e veste-se sem ajuda, exceto para amarrar os sapatos',
          value: 0,
        },
        {
          label:
            'Recebe ajuda para pegar as roupas ou vestir-se, ou permanece parcial ou completamente sem roupa',
          value: 1,
        },
      ],
    },
    {
      title:
        '3. Vestir-se (pega roupa, inclusive peças íntimas, nos armários e gavetas, e manuseia fecho, inclusive os de órteses e próteses, quando forem utilizadas)',
      options: [
        {
          label:
            'Vai so banheiro ou lugar equivalente, limpa-se e ajeita as roupas sem ajuda (pode ser objetos para apoio como bengala, andador ou cadeira de rodas e pode usar comadre ou urinol à noite, esvaziando-o de manha)',
          value: 0,
        },
        {
          label: 'Pega as roupas e veste-se sem ajuda, exceto para amarrar os sapatos',
          value: 0,
        },
        {
          label: 'Não vai ao banheiro ou equivalente para eliminação fisiológicas',
          value: 1,
        },
      ],
    },
    {
      title: '4. Transferências',
      options: [
        {
          label:
            'Delta-se e sai da cama, senta-se e levanta-se da cadeira sem ajuda (pode estar usando objeto para apoio como bengala, andador)',
          value: 0,
        },
        {
          label: 'Deita-se e sal da cama e/ou senta-se e levanta-se da cadeira com ajuda',
          value: 0,
        },
        {
          label: 'Não sai da cama',
          value: 1,
        },
      ],
    },
    {
      title: '5. Continência',
      options: [
        {
          label: 'Controla inteiramente a micção e a evacuação',
          value: 0,
        },
        {
          label: 'Tem "acidentes" ocasionais',
          value: 0,
        },
        {
          label:
            'Necessita de ajuda para manter o controle da micção e evacuação, usa cateter ou é incontinente',
          value: 1,
        },
      ],
    },
    {
      title: '6. Alimentação',
      options: [
        {
          label: 'Alimenta-se sem ajuda',
          value: 0,
        },
        {
          label: 'Alimenta-se sozinho, mas recebe ajuda para cortar came ou passar manteiga no pão',
          value: 0,
        },
        {
          label:
            'Recebe ajuda para alimentar-se, ou é alimentado parcialmente ou completamente pelo uso de cateteres ou fluidos intra venoso',
          value: 1,
        },
      ],
    },
  ]);

  ngOnInit(): void {
    this.headerService.setTitle('Índice de Katz');
  }
}
