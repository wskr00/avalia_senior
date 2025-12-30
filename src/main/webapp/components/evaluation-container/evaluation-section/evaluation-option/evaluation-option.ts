import { Component, Input } from '@angular/core';
import { QuestionOption } from '@/interfaces/evaluation';

@Component({
  selector: 'e-option',
  imports: [],
  templateUrl: './evaluation-option.html',
  styleUrl: './evaluation-option.scss',
})
export class EvaluationOption implements QuestionOption {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: number;
}
