import { Component, inject, input, model, ChangeDetectionStrategy } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationResult {
  visible = model<boolean>(false);

  result = input<IEvaluationResult>();
  title = input<string>('');
  formValues = input<EvaluationBasicInfo>();
  config = input<ScaleDefinition>();

  private pdfService = inject(PdfGeneratorService);

  close(): void {
    this.visible.set(false);
  }

  async downloadPdf(): Promise<void> {
    const currentResult = this.result();
    const currentConfig = this.config();
    const currentFormValues = this.formValues();

    if (currentResult && currentConfig && currentFormValues) {
      await this.pdfService.generateEvaluationPdf(
        this.title(),
        currentFormValues,
        currentResult,
        currentConfig
      );
    }
  }
}
