import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';

import { BasicInfo } from './basic-info/basic-info';
import { SubmitButton } from './submit-button/submit-button';
import { EvaluationFormService } from '@/services/evaluation-form';

@Component({
  selector: 'app-evaluation-container',
  imports: [ReactiveFormsModule, CardModule, BasicInfo, SubmitButton],
  templateUrl: './evaluation-container.html',
  styleUrl: './evaluation-container.scss',
  providers: [EvaluationFormService],
})
export class EvaluationContainer implements OnInit {
  protected evaluationFormService = inject(EvaluationFormService);

  @Output() finish = new EventEmitter<any>();

  ngOnInit(): void {}

  onSubmit(): void {
    const form = this.evaluationFormService.form;

    if (form.valid) {
      this.finish.emit(form.value);
    } else {
      form.markAllAsTouched();
    }
  }
}
