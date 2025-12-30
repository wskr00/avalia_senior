import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { EvaluationFormService } from '@/services/evaluation-form';

@Component({
  selector: 'app-basic-info',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    DatePickerModule,
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: './basic-info.html',
  styleUrl: './basic-info.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicInfo {
  protected evaluationFormService = inject(EvaluationFormService);
}
