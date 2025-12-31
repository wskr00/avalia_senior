import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EvaluationResult } from './evaluation-result';
import { PdfGeneratorService } from '@/services/pdf-generator';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
// Importamos os módulos reais do PrimeNG usados no template
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('EvaluationResult', () => {
  let component: EvaluationResult;
  let fixture: ComponentFixture<EvaluationResult>;
  let pdfService: PdfGeneratorService;

  const mockResult = { score: 18, interpretation: 'Dependência moderada' };
  const mockConfig = { id: 'lawton', baseline: 27, ranges: [] };
  const mockFormValues = {
    doctorName: 'Dr. Smith',
    patientName: 'John Doe',
    age: 75,
    date: new Date(),
  };

  beforeEach(async () => {
    const pdfSpy = { generateEvaluationPdf: vi.fn().mockResolvedValue(undefined) };

    await TestBed.configureTestingModule({
      // 1. Removemos o NO_ERRORS_SCHEMA e importamos os módulos necessários
      imports: [EvaluationResult, DialogModule, ButtonModule],
      providers: [
        { provide: PdfGeneratorService, useValue: pdfSpy },
        providePrimeNG({
          theme: { preset: Aura },
        }),
      ],
      // SCHEMA REMOVIDO: Agora o Angular validará se p-dialog e p-button estão corretos
    }).compileComponents();

    fixture = TestBed.createComponent(EvaluationResult);
    component = fixture.componentInstance;
    pdfService = TestBed.inject(PdfGeneratorService);

    // Configuração dos Signals de Input
    fixture.componentRef.setInput('title', 'Escala de Lawton');
    fixture.componentRef.setInput('result', mockResult);
    fixture.componentRef.setInput('config', mockConfig);
    fixture.componentRef.setInput('formValues', mockFormValues);

    // Ativando a visibilidade do modal (Signal model)
    component.visible.set(true);

    fixture.detectChanges();
  });

  it('deve ser criado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir a pontuação e a interpretação corretas no template', () => {
    // Busca elementos específicos do layout
    const scoreElement = fixture.debugElement.query(By.css('.text-5xl')).nativeElement;
    const interpretationElement = fixture.debugElement.query(By.css('.text-xl')).nativeElement;

    expect(scoreElement.textContent).toContain('18');
    expect(interpretationElement.textContent).toContain('Dependência moderada');
  });

  it('deve atualizar o estado de visible para false ao chamar close()', () => {
    component.close();
    expect(component.visible()).toBe(false);
  });

  it('deve chamar o PdfGeneratorService com todos os dados quando baixar o PDF', async () => {
    await component.downloadPdf();

    expect(pdfService.generateEvaluationPdf).toHaveBeenCalledWith(
      'Escala de Lawton',
      mockFormValues,
      mockResult,
      mockConfig
    );
  });

  it('NÃO deve chamar o PdfGeneratorService se os dados estiverem incompletos', async () => {
    fixture.componentRef.setInput('result', undefined);
    fixture.detectChanges();

    await component.downloadPdf();

    expect(pdfService.generateEvaluationPdf).not.toHaveBeenCalled();
  });

  it('deve conter o aria-label correto no botão de download', () => {
    // Com a remoção do SCHEMA, este teste garante que o p-button existe e recebeu o atributo
    const downloadBtn = fixture.debugElement.query(By.css('p-button[icon="pi pi-file-pdf"]'));
    expect(downloadBtn.attributes['ariaLabel']).toBe('Baixar resultado em PDF');
  });
});
