import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { EvaluationService } from '@/services/evaluation';

@Component({
  selector: 'app-submit-button',
  imports: [ButtonModule],
  templateUrl: './submit-button.html',
  styleUrl: './submit-button.scss',
})
export class SubmitButton {
  protected evaluationService = inject(EvaluationService);

  @Input() label: string = 'Finalizar';
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() icon: string = 'pi pi-check';

  @Output() onClick = new EventEmitter<void>();

  execute(): void {
    this.onClick.emit();
  }
}
