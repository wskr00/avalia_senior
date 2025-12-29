import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { EvaluationResult as IEvaluationResult } from '@/interfaces/evaluation';

@Component({
  selector: 'app-evaluation-result',
  imports: [DialogModule, ButtonModule],
  templateUrl: './evaluation-result.html',
  styleUrl: './evaluation-result.scss',
})
export class EvaluationResult {
  @Input() visible: boolean = false;
  @Input() result?: IEvaluationResult;

  @Output() visibleChange = new EventEmitter<boolean>();

  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  downloadPdf(): void {
    // TODO: Geração de PDF
  }
}
