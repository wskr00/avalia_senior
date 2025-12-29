import { Component, Input, ContentChildren, QueryList, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormArray, FormControl, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { EvaluationOption } from './evaluation-option/evaluation-option';
import { EvaluationFormService } from '@/services/evaluation-form';
import { EvaluationQuestion, QuestionOption } from '@/interfaces/evaluation';

@Component({
  selector: 'app-evaluation-section',
  imports: [ReactiveFormsModule, CardModule, RadioButtonModule],
  templateUrl: './evaluation-section.html',
  styleUrl: './evaluation-section.scss',
})
export class EvaluationSection implements OnInit, EvaluationQuestion {
  @Input({ required: true }) title!: string;

  @ContentChildren(EvaluationOption) optionsContent!: QueryList<EvaluationOption>;

  protected evaluationFormService = inject(EvaluationFormService);

  controlIndex!: number;

  get options(): QuestionOption[] {
    return this.optionsContent?.toArray() || [];
  }

  ngOnInit(): void {
    const responsesArray = this.evaluationFormService.form.get('responses') as FormArray;

    if (responsesArray) {
      this.controlIndex = responsesArray.length;
      responsesArray.push(new FormControl(null, Validators.required));
    }
  }
}
