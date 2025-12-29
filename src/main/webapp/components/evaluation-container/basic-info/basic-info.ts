import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { EvaluationService } from '@/services/evaluation';

@Component({
  selector: 'app-basic-info',
  imports: [ReactiveFormsModule, InputTextModule, InputNumberModule, DatePickerModule],
  templateUrl: './basic-info.html',
  styleUrl: './basic-info.scss',
})
export class BasicInfo {
  protected evaluationService = inject(EvaluationService);
}
