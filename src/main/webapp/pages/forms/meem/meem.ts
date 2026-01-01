import { EvaluationForm } from '@/components/evaluation-form/evaluation-form';
import { EvaluationQuestion, ScaleDefinition } from '@/interfaces/evaluation';
import { HeaderService } from '@/services/header';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';

@Component({
  selector: 'app-meem',
  imports: [EvaluationForm],
  templateUrl: './meem.html',
  styleUrl: './meem.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Meem implements OnInit {
  private headerService = inject(HeaderService);

  protected meem_config = signal<ScaleDefinition>({
    id: 'meem',
    baseline: 30,
    ranges: [
      { min: 23, max: 30, label: 'Normal' },
      { min: 0, max: 22, label: 'Suspeita de perda cognitiva' },
    ],
  });

  protected meem_questions = signal<EvaluationQuestion[]>([
    {
      title: '1. Qual a escolaridade do paciente (anos completos de estudo)?',
      options: [
        { label: 'Analfabeto', value: 0 },
        { label: '1 a 3 anos', value: 0 },
        { label: '4 a 7 anos', value: 0 },
        { label: 'Acima de 7 anos', value: 0 },
      ],
    },

    {
      title: '2. Qual é o ano, estação, dia da semana, dia do mês e mês.',
      options: [
        { label: 'Paciente não acertou nenhuma', value: -5 },
        { label: 'Paciente acertou uma', value: -4 },
        { label: 'Paciente acertou duas', value: -3 },
        { label: 'Paciente acertou três', value: -2 },
        { label: 'Paciente acertou quatro', value: -1 },
        { label: 'Paciente acertou cinco', value: 0 },
      ],
    },

    {
      title: '3. Onde estamos? País, Estado, Cidade, Rua ou Local, nº ou Andar.',
      options: [
        { label: 'Paciente não acertou nenhuma', value: -5 },
        { label: 'Paciente acertou uma', value: -4 },
        { label: 'Paciente acertou duas', value: -3 },
        { label: 'Paciente acertou três', value: -2 },
        { label: 'Paciente acertou quatro', value: -1 },
        { label: 'Paciente acertou cinco', value: 0 },
      ],
    },

    {
      title:
        '4. Diga ao paciente três palavras. Peça-lhe para prestar atenção, pois terá que repetir mais tarde. Pergunte pelas três palavras após dizê-las. Repita até cinco vezes e conte quantas palavras ele acertou.',
      options: [
        { label: 'Paciente não acertou nenhuma', value: -3 },
        { label: 'Paciente acertou uma', value: -2 },
        { label: 'Paciente acertou duas', value: -1 },
        { label: 'Paciente acertou três', value: 0 },
      ],
    },

    {
      title:
        '5. Peça ao paciente para subtrair 100 de 7 sucessivamente, 5 vezes (100 - 7) → (93 - 7) → (86 - 7) → (79 - 7) → (72 - 7) → (65).',
      options: [
        { label: 'Paciente não acertou nenhuma', value: -5 },
        { label: 'Paciente acertou uma', value: -4 },
        { label: 'Paciente acertou duas', value: -3 },
        { label: 'Paciente acertou três', value: -2 },
        { label: 'Paciente acertou quatro', value: -1 },
        { label: 'Paciente acertou cinco', value: 0 },
      ],
    },

    {
      title: '6. Perguntar pelas três palavras da questão 4 novamente.',
      options: [
        { label: 'Paciente não acertou nenhuma', value: -3 },
        { label: 'Paciente acertou uma', value: -2 },
        { label: 'Paciente acertou duas', value: -1 },
        { label: 'Paciente acertou três', value: 0 },
      ],
    },

    {
      title: '7. Identificar lápis e relógio de pulso (sem estar no pulso).',
      options: [
        { label: 'Paciente não acertou nenhuma', value: -2 },
        { label: 'Paciente acertou uma', value: -1 },
        { label: 'Paciente acertou duas', value: 0 },
      ],
    },

    {
      title: "8. Repetir a frase: 'Nem aqui, nem ali, nem lá'.",
      options: [
        { label: 'Não conseguiu', value: -1 },
        { label: 'Conseguiu', value: 0 },
      ],
    },

    {
      title:
        '9. Seguir o comando de 3 estágios: "pegue o papel com a mão direita, dobre ao meio, coloque no chão." (Falar essa frase de forma inteira apenas uma vez).',
      options: [
        { label: 'Não conseguiu nenhum', value: -3 },
        { label: 'Conseguiu um', value: -2 },
        { label: 'Conseguiu dois', value: -1 },
        { label: 'Conseguiu três', value: 0 },
      ],
    },

    {
      title: '10. Ler "fechar os olhos" e executar "fechar os olhos".',
      options: [
        { label: 'Não conseguiu', value: -1 },
        { label: 'Conseguiu', value: 0 },
      ],
    },

    {
      title: '11. Escrever uma frase (um pensamento, uma ideia) com sentido completo.',
      options: [
        { label: 'Não conseguiu', value: -1 },
        { label: 'Conseguiu', value: 0 },
      ],
    },

    {
      title: '12. Copiar o desenho:',
      image: 'assets/meem.jpg',
      imageAlt: 'Figura com dois pentágonos sobrepostos.',
      options: [
        { label: 'Não conseguiu', value: -1 },
        { label: 'Conseguiu', value: 0 },
      ],
    },
  ]);

  ngOnInit(): void {
    this.headerService.setTitle('Mini Exame do Estado Mental');
  }
}
