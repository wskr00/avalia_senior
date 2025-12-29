import { Component, Input } from '@angular/core';

@Component({
  selector: 'p-option',
  imports: [],
  templateUrl: './evaluation-option.html',
  styleUrl: './evaluation-option.scss',
})
export class EvaluationOption {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: any;
}
