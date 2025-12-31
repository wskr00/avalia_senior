import { Component, input, output, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs/operators';
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

  loading = input<boolean>(false);
  disabled = input<boolean>(false);

  onClick = output<void>();

  isFormValid = toSignal(
    this.evaluationFormService.form.statusChanges.pipe(
      startWith(this.evaluationFormService.form.status),
      map((status) => status === 'VALID')
    ),
    { initialValue: this.evaluationFormService.form.valid }
  );

  execute(): void {
    this.onClick.emit();
  }
}
