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
      { min: 0, max: 20, label: 'Dependência Total' },
      { min: 21, max: 27, label: 'Independência' },
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
  });

  it('deve ser criado com sucesso', () => {
    expect(service).toBeTruthy();
  });

  it('deve formatar corretamente a tabela de referências para valores exatos e intervalos', async () => {
    const mixedConfig: ScaleDefinition = {
      id: 'mixed-scale',
      baseline: 0,
      ranges: [
        { min: 0, label: 'Zero absoluto' },
        { min: 1, label: 'Ponto único' },
        { min: 2, max: 5, label: 'Intervalo' },
        { min: 10, label: 'Dez pontos' },
      ],
    };

    await service.generateEvaluationPdf('Teste Misto', mockFormValues, mockResult, mixedConfig);

    const callArgs = vi.mocked(pdfmeGenerator.generate).mock.calls[0][0];
    const refs = (callArgs.inputs[0]['tabelaReferencias'] || '').toString();

    expect(refs).toContain('• 0 pts: Zero absoluto');

    expect(refs).toContain('• 1 pt: Ponto único');

    expect(refs).toContain('• 2-5 pts: Intervalo');

    expect(refs).toContain('• 10 pts: Dez pontos');
  });

  it('deve chamar a função generate com os dados da escala e referências', async () => {
    const scaleTitle = 'Escala de Lawton';
    await service.generateEvaluationPdf(scaleTitle, mockFormValues, mockResult, mockConfig);

    expect(pdfmeGenerator.generate).toHaveBeenCalled();

    const callArgs = vi.mocked(pdfmeGenerator.generate).mock.calls[0][0];
    const inputs = callArgs.inputs[0];

    const allValues = Object.values(inputs).join(' ').toUpperCase();
    expect(allValues).toContain(scaleTitle.toUpperCase());

    const refs = (inputs['tabelaReferencias'] || '').toString();
    expect(refs).toContain('Dependência Total');
    expect(refs).toContain('Independência');
  });

  it('deve disparar o download com um nome de arquivo baseado no título', async () => {
    const createElementSpy = vi.spyOn(document, 'createElement');
    const title = 'Mini-Mental';

    await service.generateEvaluationPdf(title, mockFormValues, mockResult, mockConfig);

    expect(createElementSpy).toHaveBeenCalledWith('a');
    const mockLink = createElementSpy.mock.results[0].value as any;

    expect(mockLink.download).toContain(title);
    expect(mockLink.download).toMatch(/\.pdf$/);
  });

  it('deve formatar a data para o padrão brasileiro (DD/MM/YYYY) no PDF', async () => {
    await service.generateEvaluationPdf('Teste', mockFormValues, mockResult, mockConfig);

    const callArgs = vi.mocked(pdfmeGenerator.generate).mock.calls[0][0];
    const inputs = callArgs.inputs[0];

    expect(inputs['dataAvaliacaoValue']).toBe('01/01/2025');
  });

  it('deve enviar os dados do médico e paciente corretamente', async () => {
    await service.generateEvaluationPdf('Teste', mockFormValues, mockResult, mockConfig);

    const inputs = vi.mocked(pdfmeGenerator.generate).mock.calls[0][0].inputs[0];

    expect(inputs).toHaveProperty('nomeMedico', mockFormValues.doctorName);
    expect(inputs).toHaveProperty('nomePaciente', mockFormValues.patientName);

    expect(inputs['idadePaciente']).toBe(`${mockFormValues.age} anos`);
  });
});
