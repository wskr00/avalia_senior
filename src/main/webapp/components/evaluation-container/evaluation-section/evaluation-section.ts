import { Component, Input, ContentChildren, QueryList, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormArray, FormControl, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { EvaluationOption } from './evaluation-option/evaluation-option';
import { EvaluationService } from '@/services/evaluation';

@Component({
  selector: 'app-evaluation-section',
  imports: [ReactiveFormsModule, CardModule, RadioButtonModule],
  templateUrl: './evaluation-section.html',
  styleUrl: './evaluation-section.scss',
})
export class EvaluationSection implements OnInit {
  @Input({ required: true }) title!: string;

  @ContentChildren(EvaluationOption) optionsContent!: QueryList<EvaluationOption>;

  protected evaluationService = inject(EvaluationService);

  controlIndex!: number;

  ngOnInit(): void {
    const responsesArray = this.evaluationService.form.get('responses') as FormArray;

    if (responsesArray) {
      this.controlIndex = responsesArray.length;
      responsesArray.push(new FormControl(null, Validators.required));
    }
  }
}
