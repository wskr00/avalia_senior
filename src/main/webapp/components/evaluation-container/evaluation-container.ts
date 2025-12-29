import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';

import { HeaderService } from '@/services/header';
import { BasicInfo } from './basic-info/basic-info';
import { SubmitButton } from './submit-button/submit-button';
import { EvaluationService } from '@/services/evaluation';

@Component({
  selector: 'app-evaluation-container',
  imports: [ReactiveFormsModule, CardModule, BasicInfo, SubmitButton],
  templateUrl: './evaluation-container.html',
  styleUrl: './evaluation-container.scss',
  providers: [EvaluationService],
})
export class EvaluationContainer implements OnInit {
  private headerService = inject(HeaderService);
  protected evaluationService = inject(EvaluationService);

  @Output() finish = new EventEmitter<any>();

  ngOnInit(): void {
    this.headerService.setContext('form');
  }

  onSubmit(): void {
    const form = this.evaluationService.form;

    if (form.valid) {
      this.finish.emit(form.value);
    } else {
      form.markAllAsTouched();
    }
  }
}
