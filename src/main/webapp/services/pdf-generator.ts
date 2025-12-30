import { Injectable } from '@angular/core';
import { generate } from '@pdfme/generator';
import { text } from '@pdfme/schemas';
import { BLANK_PDF, Template } from '@pdfme/common';
import { ScaleDefinition, EvaluationResult, EvaluationBasicInfo } from '../interfaces/evaluation';

@Injectable({
  providedIn: 'root',
})
export class PdfGeneratorService {
  async generateEvaluationPdf(
    title: string,
    formValues: EvaluationBasicInfo,
    result: EvaluationResult,
    config: ScaleDefinition
  ) {
    const referencesStr = config.ranges.map((r) => `${r.min}-${r.max} pts: ${r.label}`).join('\n');

    const template: Template = {
      basePdf: BLANK_PDF,
      schemas: [
        [
          {
            name: 'tituloEscala',
            type: 'text',
            position: { x: 10, y: 20 },
            width: 190,
            height: 10,
            alignment: 'center',
            fontSize: 20,
            fontName: 'NotoSerifJP-Bold',
          },
          {
            name: 'labelMedico',
            type: 'text',
            position: { x: 20, y: 50 },
            width: 30,
            height: 7,
            fontSize: 10,
            fontName: 'NotoSerifJP-Bold',
          },
          {
            name: 'nomeMedico',
            type: 'text',
            position: { x: 50, y: 50 },
            width: 140,
            height: 7,
            fontSize: 10,
          },
          {
            name: 'labelPaciente',
            type: 'text',
            position: { x: 20, y: 60 },
            width: 30,
            height: 7,
            fontSize: 10,
            fontName: 'NotoSerifJP-Bold',
          },
          {
            name: 'nomePaciente',
            type: 'text',
            position: { x: 50, y: 60 },
            width: 100,
            height: 7,
            fontSize: 10,
          },
          {
            name: 'labelIdade',
            type: 'text',
            position: { x: 155, y: 60 },
            width: 15,
            height: 7,
            fontSize: 10,
            fontName: 'NotoSerifJP-Bold',
          },
          {
            name: 'idadePaciente',
            type: 'text',
            position: { x: 170, y: 60 },
            width: 20,
            height: 7,
            fontSize: 10,
          },
          {
            name: 'labelData',
            type: 'text',
            position: { x: 20, y: 70 },
            width: 30,
            height: 7,
            fontSize: 10,
            fontName: 'NotoSerifJP-Bold',
          },
          {
            name: 'dataAvaliacao',
            type: 'text',
            position: { x: 50, y: 70 },
            width: 50,
            height: 7,
            fontSize: 10,
          },
          {
            name: 'linhaSeparadora',
            type: 'text',
            position: { x: 20, y: 85 },
            width: 170,
            height: 1,
            backgroundColor: '#e2e8f0',
          },
          {
            name: 'labelPontuacao',
            type: 'text',
            position: { x: 20, y: 100 },
            width: 40,
            height: 10,
            fontSize: 12,
            fontName: 'NotoSerifJP-Bold',
          },
          {
            name: 'pontuacaoTotal',
            type: 'text',
            position: { x: 20, y: 110 },
            width: 40,
            height: 15,
            fontSize: 24,
            fontName: 'NotoSerifJP-Bold',
            alignment: 'center',
          },
          {
            name: 'labelResultado',
            type: 'text',
            position: { x: 70, y: 100 },
            width: 120,
            height: 10,
            fontSize: 12,
            fontName: 'NotoSerifJP-Bold',
          },
          {
            name: 'interpretacaoResultado',
            type: 'text',
            position: { x: 70, y: 110 },
            width: 120,
            height: 15,
            fontSize: 14,
          },
          {
            name: 'labelReferencias',
            type: 'text',
            position: { x: 20, y: 140 },
            width: 170,
            height: 7,
            fontSize: 10,
            fontName: 'NotoSerifJP-Bold',
          },
          {
            name: 'tabelaReferencias',
            type: 'text',
            position: { x: 20, y: 150 },
            width: 170,
            height: 50,
            fontSize: 9,
            lineHeight: 1.5,
          },
        ],
      ],
    };

    const inputs = [
      {
        tituloEscala: title,
        labelMedico: 'Médico:',
        nomeMedico: formValues.doctorName,
        labelPaciente: 'Paciente:',
        nomePaciente: formValues.patientName,
        labelIdade: 'Idade:',
        idadePaciente: String(formValues.age),
        labelData: 'Data:',
        dataAvaliacao: new Date(formValues.date).toLocaleDateString('pt-BR'),
        linhaSeparadora: '',
        labelPontuacao: 'Pontuação Total',
        pontuacaoTotal: String(result.score),
        labelResultado: 'Resultado',
        interpretacaoResultado: result.interpretation,
        labelReferencias: 'Tabela de Referência:',
        tabelaReferencias: referencesStr,
      },
    ];

    const pdf = await generate({
      template,
      inputs,
      plugins: { text },
    });

    const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Resultado_${title.replace(/\s+/g, '_')}.pdf`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
