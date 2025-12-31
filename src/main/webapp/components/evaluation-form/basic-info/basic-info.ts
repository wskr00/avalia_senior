import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { EvaluationFormService } from '@/services/evaluation-form';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PrimeNG } from 'primeng/config';

@Component({
  selector: 'app-basic-info',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    IconFieldModule,
    InputIconModule,
    FloatLabelModule,
  ],
  templateUrl: './basic-info.html',
  styleUrl: './basic-info.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicInfo implements OnInit {
  protected evaluationFormService = inject(EvaluationFormService);
  private config = inject(PrimeNG);

  ngOnInit() {
    this.config.setTranslation({
      chooseDate: 'Escolher data',
      chooseMonth: 'Escolher mês',
      chooseYear: 'Escolher ano',
      prevDecade: 'Década anterior',
      nextDecade: 'Próxima década',
      prevYear: 'Ano anterior',
      nextYear: 'Próximo ano',
      prevMonth: 'Mês anterior',
      nextMonth: 'Próximo mês',
      dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      monthNames: [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
      ],
      monthNamesShort: [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
      ],
      today: 'Hoje',
      clear: 'Limpar',
    });
  }
}
