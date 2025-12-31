import { TestBed } from '@angular/core/testing';
import { PdfGeneratorService } from './pdf-generator';
import * as pdfmeGenerator from '@pdfme/generator';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EvaluationBasicInfo, EvaluationResult, ScaleDefinition } from '@/interfaces/evaluation';

vi.mock('@pdfme/generator', () => ({
  generate: vi.fn().mockResolvedValue({
    buffer: new Uint8Array([1, 2, 3]),
  }),
}));

describe('PdfGeneratorService', () => {
  let service: PdfGeneratorService;

  const mockFormValues: EvaluationBasicInfo = {
    doctorName: 'Dr. Smith',
    patientName: 'John Doe',
    age: 80,
    date: new Date('2025-01-01T12:00:00'),
  };

  const mockResult: EvaluationResult = {
    score: 25,
    interpretation: 'Independente',
  };

  const mockConfig: ScaleDefinition = {
    id: 'lawton',
    baseline: 27,
    ranges: [
      { min: 0, max: 20, label: 'Dependente' },
      { min: 21, max: 27, label: 'Independente' },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PdfGeneratorService],
    });
    service = TestBed.inject(PdfGeneratorService);

    vi.stubGlobal('URL', {
      createObjectURL: vi.fn().mockReturnValue('blob:mock-url'),
      revokeObjectURL: vi.fn(),
    });

    vi.spyOn(document, 'createElement').mockReturnValue({
      setAttribute: vi.fn(),
      click: vi.fn(),
      remove: vi.fn(),
      href: '',
      download: '',
    } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('deve ser criado com sucesso', () => {
    expect(service).toBeTruthy();
  });

  it('deve formatar corretamente as referências e chamar a função generate', async () => {
    await service.generateEvaluationPdf('Escala de Lawton', mockFormValues, mockResult, mockConfig);

    expect(pdfmeGenerator.generate).toHaveBeenCalled();

    const callArgs = vi.mocked(pdfmeGenerator.generate).mock.calls[0][0];

    const firstInput = callArgs.inputs[0];
    expect(firstInput['tituloEscala']).toBe('ESCALA DE LAWTON');

    const expectedRef = '• 0-20 pts: Dependente\n• 21-27 pts: Independente';
    expect(firstInput['tabelaReferencias']).toBe(expectedRef);
  });

  it('deve criar um link temporário para disparar o download do arquivo', async () => {
    const createElementSpy = vi.spyOn(document, 'createElement');

    await service.generateEvaluationPdf('Teste', mockFormValues, mockResult, mockConfig);

    expect(createElementSpy).toHaveBeenCalledWith('a');

    const mockLink = createElementSpy.mock.results[0].value as any;
    expect(mockLink.download).toBe('Resultado_Teste.pdf');
  });

  it('deve formatar a data para o padrão pt-BR no PDF', async () => {
    await service.generateEvaluationPdf('Teste', mockFormValues, mockResult, mockConfig);

    const callArgs = vi.mocked(pdfmeGenerator.generate).mock.calls[0][0];
    const firstInput = callArgs.inputs[0];

    expect(firstInput['dataAvaliacaoValue']).toBe('01/01/2025');
  });
});
