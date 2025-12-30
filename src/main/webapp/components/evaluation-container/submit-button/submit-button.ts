import { Component, input, output, inject, ChangeDetectionStrategy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { EvaluationFormService } from '@/services/evaluation-form';

@Component({
  selector: 'app-submit-button',
  imports: [ButtonModule],
  templateUrl: './submit-button.html',
  styleUrl: './submit-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitButton {
  protected evaluationFormService = inject(EvaluationFormService);

  label = input<string>('Finalizar');
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  icon = input<string>('pi pi-check');

  onClick = output<void>();

  execute(): void {
    this.onClick.emit();
  }
}
