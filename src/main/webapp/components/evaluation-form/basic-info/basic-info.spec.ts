import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BasicInfo } from './basic-info';
import { EvaluationFormService } from '@/services/evaluation-form';
import { providePrimeNG } from 'primeng/config';
import { PrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('BasicInfo', () => {
  let component: BasicInfo;
  let fixture: ComponentFixture<BasicInfo>;
  let mockFormService: any;
  let primengConfig: PrimeNG;

  beforeEach(async () => {
    const fb = new FormBuilder();
    const mockForm = fb.group({
      basicInfo: fb.group({
        doctorName: ['', Validators.required],
        patientName: ['', Validators.required],
        age: [null, Validators.required],
        date: [new Date(), Validators.required],
      }),
    });

    mockFormService = {
      form: mockForm,
    };

    await TestBed.configureTestingModule({
      imports: [BasicInfo, ReactiveFormsModule],
      providers: [
        { provide: EvaluationFormService, useValue: mockFormService },
        providePrimeNG({
          theme: { preset: Aura },
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BasicInfo);
    component = fixture.componentInstance;
    primengConfig = TestBed.inject(PrimeNG);
    fixture.detectChanges();
  });

  it('deve ser criado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve configurar as traduções do PrimeNG para Português no ngOnInit', () => {
    expect(primengConfig.getTranslation('today')).toBe('Hoje');
    expect(primengConfig.getTranslation('clear')).toBe('Limpar');
    expect(primengConfig.getTranslation('dayNamesMin')).toEqual([
      'D',
      'S',
      'T',
      'Q',
      'Q',
      'S',
      'S',
    ]);
  });

  it('deve atualizar o formulário quando o valor do input de nome do médico mudar', () => {
    const inputDe = fixture.debugElement.query(By.css('#doctorName'));
    const inputEl = inputDe.nativeElement;

    inputEl.value = 'Dr. Gregory House';
    inputEl.dispatchEvent(new Event('input'));

    const formValue = mockFormService.form.get('basicInfo.doctorName').value;
    expect(formValue).toBe('Dr. Gregory House');
  });

  it('deve refletir no HTML os valores definidos programaticamente no formulário', () => {
    mockFormService.form.get('basicInfo.patientName').setValue('Wilson');
    fixture.detectChanges();

    const inputEl = fixture.debugElement.query(By.css('#patientName')).nativeElement;
    expect(inputEl.value).toBe('Wilson');
  });

  it('deve ter os atributos aria-required configurados nos inputs de texto', () => {
    const doctorInput = fixture.debugElement.query(By.css('#doctorName')).nativeElement;
    const patientInput = fixture.debugElement.query(By.css('#patientName')).nativeElement;

    expect(doctorInput.getAttribute('aria-required')).toBe('true');
    expect(patientInput.getAttribute('aria-required')).toBe('true');
  });

  it('deve vincular corretamente o controle de idade ao p-inputNumber', () => {
    const ageControl = fixture.debugElement.query(By.css('p-inputNumber'));
    expect(ageControl.attributes['formControlName']).toBe('age');
  });

  it('deve vincular corretamente o controle de data ao p-datepicker', () => {
    const datePicker = fixture.debugElement.query(By.css('p-datepicker'));
    expect(datePicker.attributes['formControlName']).toBe('date');
    expect(datePicker.attributes['dateFormat']).toBe('dd/mm/yy');
  });
});
