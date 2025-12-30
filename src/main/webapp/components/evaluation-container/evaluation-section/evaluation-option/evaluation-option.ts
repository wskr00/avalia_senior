import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'e-option',
  imports: [],
  templateUrl: './evaluation-option.html',
  styleUrl: './evaluation-option.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationOption {
  label = input.required<string>();
  value = input.required<number>();
}
