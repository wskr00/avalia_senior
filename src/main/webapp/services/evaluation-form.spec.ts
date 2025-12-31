import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { EvaluationFormService } from './evaluation-form';
import { describe, it, expect, beforeEach } from 'vitest';

describe('EvaluationFormService', () => {
  let service: EvaluationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [EvaluationFormService],
    });
    service = TestBed.inject(EvaluationFormService);
  });

  it('deve iniciar com o formulário básico configurado e inválido', () => {
    expect(service.form.contains('basicInfo')).toBe(true);
    expect(service.form.contains('responses')).toBe(true);
    expect(service.form.valid).toBe(false);
    expect(service.isValid()).toBe(false);
  });

  it('deve criar a quantidade correta de controles de resposta', () => {
    service.initializeResponses(5);
    const responses = service.responses;

    expect(responses.length).toBe(5);
    expect(responses.at(0).validator).toBeDefined();
  });

  it('deve reduzir o tamanho do array mantendo os dados dos controles remanescentes', () => {
    service.initializeResponses(5);
    service.responses.at(0).setValue(1);
    service.responses.at(1).setValue(2);
    service.responses.at(2).setValue(3);

    service.initializeResponses(3);

    expect(service.responses.length).toBe(3);
    expect(service.responses.at(0).value).toBe(1);
    expect(service.responses.at(2).value).toBe(3);
  });

  it('deve aumentar o array preservando os valores já existentes', () => {
    service.initializeResponses(2);
    service.responses.at(0).setValue(10);

    service.initializeResponses(4);

    expect(service.responses.length).toBe(4);
    expect(service.responses.at(0).value).toBe(10);
    expect(service.responses.at(3).value).toBe(null);
  });

  it('deve atualizar o sinal isValid quando o formulário se tornar válido', () => {
    expect(service.isValid()).toBe(false);

    service.initializeResponses(1);

    service.patchBasicInfo({
      doctorName: 'Dr. Belknap',
      patientName: 'Walter White',
      age: 50,
      date: new Date(),
    });

    service.responses.at(0).setValue(0);

    expect(service.form.valid).toBe(true);
    expect(service.isValid()).toBe(true);
  });

  it('deve invalidar o formulário se um campo obrigatório do basicInfo for removido', () => {
    service.patchBasicInfo({
      doctorName: 'Dr. House',
      patientName: 'João',
      age: 45,
    });
    service.initializeResponses(0);

    expect(service.form.valid).toBe(true);

    service.form.get('basicInfo.doctorName')?.setValue('');

    expect(service.form.valid).toBe(false);
    expect(service.isValid()).toBe(false);
  });

  it('deve retornar os valores de basicInfo corretamente via getter', () => {
    const mockDate = new Date(2025, 0, 1);
    service.patchBasicInfo({
      doctorName: 'Med Teste',
      patientName: 'Pac Teste',
      age: 80,
      date: mockDate,
    });

    const values = service.basicInfoValue;
    expect(values.doctorName).toBe('Med Teste');
    expect(values.age).toBe(80);
    expect(values.date).toEqual(mockDate);
  });

  it('deve permitir configurar e recuperar a configuração da escala', () => {
    const config = { id: 'escala-x', baseline: 10, ranges: [] } as any;
    service.setScaleConfig(config);
    expect(service.scaleConfig).toEqual(config);
  });
});
