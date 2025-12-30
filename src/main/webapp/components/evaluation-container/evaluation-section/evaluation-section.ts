import {
  Component,
  input,
  contentChildren,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  computed,
} from '@angular/core';
import { ReactiveFormsModule, FormArray, FormControl, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { EvaluationOption } from './evaluation-option/evaluation-option';
import { EvaluationFormService } from '@/services/evaluation-form';

@Component({
  selector: 'app-evaluation-section',
  imports: [ReactiveFormsModule, CardModule, RadioButtonModule],
  templateUrl: './evaluation-section.html',
  styleUrl: './evaluation-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationSection implements OnInit {
  protected evaluationFormService = inject(EvaluationFormService);

  title = input.required<string>();
  optionsContent = contentChildren(EvaluationOption);

  options = computed(() => this.optionsContent());

  controlIndex!: number;

  ngOnInit(): void {
    const responsesArray = this.evaluationFormService.form.get('responses') as FormArray;

    if (responsesArray) {
      this.controlIndex = responsesArray.length;
      responsesArray.push(new FormControl(null, Validators.required));
    }
  }
}
