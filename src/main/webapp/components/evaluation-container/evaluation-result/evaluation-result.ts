import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {
  EvaluationBasicInfo,
  EvaluationResult as IEvaluationResult,
  ScaleDefinition,
} from '../../../interfaces/evaluation';
import { PdfGeneratorService } from '../../../services/pdf-generator';

@Component({
  selector: 'app-evaluation-result',
  imports: [DialogModule, ButtonModule],
  templateUrl: './evaluation-result.html',
  styleUrl: './evaluation-result.scss',
})
export class EvaluationResult {
  @Input() visible: boolean = false;
  @Input() result?: IEvaluationResult;
  @Input() title: string = '';
  @Input() formValues?: EvaluationBasicInfo;
  @Input() config?: ScaleDefinition;

  @Output() visibleChange = new EventEmitter<boolean>();

  private pdfService = inject(PdfGeneratorService);

  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  async downloadPdf(): Promise<void> {
    if (this.result && this.config && this.formValues) {
      await this.pdfService.generateEvaluationPdf(
        this.title,
        this.formValues,
        this.result,
        this.config
      );
    }
  }
}
