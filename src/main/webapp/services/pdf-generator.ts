import { EvaluationBasicInfo, EvaluationResult, ScaleDefinition } from '@/interfaces/evaluation';
import { Injectable } from '@angular/core';
import { CUSTOM_A4_PDF, Template } from '@pdfme/common';
import { generate } from '@pdfme/generator';
import { text } from '@pdfme/schemas';

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
    const referencesStr = config.ranges
      .map((r) => {
        const isRange = r.max !== undefined && r.max !== r.min;

        if (isRange) {
          return `• ${r.min}-${r.max} pts: ${r.label}`;
        }

        const unit = r.min === 1 ? 'pt' : 'pts';
        return `• ${r.min} ${unit}: ${r.label}`;
      })
      .join('\n');

    const template: Template = {
      basePdf: CUSTOM_A4_PDF,
      schemas: [
        [
          {
            name: 'headerBg',
            type: 'text',
            position: { x: 0, y: 0 },
            width: 210,
            height: 25,
            backgroundColor: '#a855f7',
          },
          {
            name: 'tituloEscala',
            type: 'text',
            position: { x: 10, y: 7 },
            width: 190,
            height: 10,
            alignment: 'center',
            fontSize: 18,
            fontColor: '#ffffff',
            fontName: 'Times-Bold',
          },

          {
            name: 'labelMedico',
            type: 'text',
            position: { x: 20, y: 40 },
            width: 80,
            height: 5,
            fontSize: 10,
            fontColor: '#7e22ce',
            fontName: 'Times-Bold',
          },
          {
            name: 'nomeMedico',
            type: 'text',
            position: { x: 20, y: 46 },
            width: 80,
            height: 7,
            fontSize: 12,
            fontName: 'Times-Roman',
          },
          {
            name: 'labelData',
            type: 'text',
            position: { x: 130, y: 40 },
            width: 60,
            height: 5,
            fontSize: 10,
            fontColor: '#7e22ce',
            fontName: 'Times-Bold',
            alignment: 'right',
          },
          {
            name: 'dataAvaliacaoValue',
            type: 'text',
            position: { x: 130, y: 46 },
            width: 60,
            height: 7,
            fontSize: 12,
            fontName: 'Times-Roman',
            alignment: 'right',
          },

          {
            name: 'labelPaciente',
            type: 'text',
            position: { x: 20, y: 60 },
            width: 80,
            height: 5,
            fontSize: 10,
            fontColor: '#7e22ce',
            fontName: 'Times-Bold',
          },
          {
            name: 'nomePaciente',
            type: 'text',
            position: { x: 20, y: 66 },
            width: 80,
            height: 7,
            fontSize: 12,
            fontName: 'Times-Roman',
          },
          {
            name: 'labelIdade',
            type: 'text',
            position: { x: 130, y: 60 },
            width: 60,
            height: 5,
            fontSize: 10,
            fontColor: '#7e22ce',
            fontName: 'Times-Bold',
            alignment: 'right',
          },
          {
            name: 'idadePaciente',
            type: 'text',
            position: { x: 130, y: 66 },
            width: 60,
            height: 7,
            fontSize: 12,
            fontName: 'Times-Roman',
            alignment: 'right',
          },

          {
            name: 'resultCard',
            type: 'text',
            position: { x: 20, y: 85 },
            width: 170,
            height: 35,
            backgroundColor: '#faf5ff',
          },
          {
            name: 'labelPontuacao',
            type: 'text',
            position: { x: 30, y: 90 },
            width: 60,
            height: 5,
            fontSize: 10,
            fontColor: '#a855f7',
            fontName: 'Times-Bold',
            alignment: 'left',
          },
          {
            name: 'pontuacaoTotal',
            type: 'text',
            position: { x: 30, y: 97 },
            width: 60,
            height: 15,
            fontSize: 28,
            fontColor: '#7e22ce',
            fontName: 'Times-Bold',
            alignment: 'left',
          },
          {
            name: 'labelResultado',
            type: 'text',
            position: { x: 100, y: 90 },
            width: 80,
            height: 5,
            fontSize: 10,
            fontColor: '#a855f7',
            fontName: 'Times-Bold',
            alignment: 'right',
          },
          {
            name: 'interpretacaoResultado',
            type: 'text',
            position: { x: 100, y: 97 },
            width: 80,
            height: 15,
            fontSize: 16,
            fontColor: '#2e1065',
            fontName: 'Times-Bold',
            alignment: 'right',
          },

          {
            name: 'labelReferencias',
            type: 'text',
            position: { x: 20, y: 140 },
            width: 100,
            height: 7,
            fontSize: 11,
            fontColor: '#a855f7',
            fontName: 'Times-Bold',
          },
          {
            name: 'branding',
            type: 'text',
            position: { x: 130, y: 140 },
            width: 60,
            height: 15,
            fontSize: 12,
            fontColor: '#a855f7',
            fontName: 'Times-Bold',
            alignment: 'right',
            lineHeight: 1.2,
          },
          {
            name: 'tabelaReferencias',
            type: 'text',
            position: { x: 20, y: 150 },
            width: 170,
            height: 60,
            fontSize: 11,
            lineHeight: 1.4,
            fontColor: '#4b5563',
            fontName: 'Times-Roman',
          },
        ],
      ],
    };

    const inputs = [
      {
        headerBg: ' ',
        tituloEscala: title.toUpperCase(),
        labelMedico: 'Médico',
        nomeMedico: formValues.doctorName,
        labelData: 'Data',
        dataAvaliacaoValue: new Date(formValues.date).toLocaleDateString('pt-BR'),
        labelPaciente: 'Paciente',
        nomePaciente: formValues.patientName,
        labelIdade: 'Idade do Paciente',
        idadePaciente: `${formValues.age} anos`,
        resultCard: ' ',
        labelPontuacao: 'PONTUAÇÃO',
        pontuacaoTotal: String(result.score),
        labelResultado: 'RESULTADO',
        interpretacaoResultado: result.interpretation,
        labelReferencias: 'Critérios de Referência',
        branding: 'Avalia\nSenior',
        tabelaReferencias: referencesStr,
      },
    ];

    const pdf = await generate({
      template,
      inputs,
      plugins: { text },
    });

    const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Resultado_${title.replace(/\s+/g, '_')}.pdf`;
    link.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
      link.remove();
    }, 100);
  }
}
