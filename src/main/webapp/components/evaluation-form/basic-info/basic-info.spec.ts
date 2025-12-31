import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BasicInfo } from './basic-info';
import { EvaluationFormService } from '@/services/evaluation-form';
import { providePrimeNG } from 'primeng/config';
import { PrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader, ComponentHarness } from '@angular/cdk/testing';

import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';

class InputNumberHarness extends ComponentHarness {
  static hostSelector = 'p-inputNumber';
  async getFormControlName() {
    return (await this.host()).getAttribute('formControlName');
  }
}

class DatePickerHarness extends ComponentHarness {
  static hostSelector = 'p-datepicker';
  async getFormControlName() {
    return (await this.host()).getAttribute('formControlName');
  }
  async getDateFormat() {
    return (await this.host()).getAttribute('dateFormat');
  }
}

describe('BasicInfo', () => {
  let component: BasicInfo;
  let fixture: ComponentFixture<BasicInfo>;
  let mockFormService: any;
  let primengConfig: PrimeNG;
  let loader: HarnessLoader;

  beforeAll(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })
    );
  });

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

    mockFormService = { form: mockForm };

    await TestBed.configureTestingModule({
      imports: [
        BasicInfo,
        ReactiveFormsModule,
        InputTextModule,
        InputNumberModule,
        DatePickerModule,
        FloatLabelModule,
      ],
      providers: [
        { provide: EvaluationFormService, useValue: mockFormService },
        providePrimeNG({ theme: { preset: Aura } }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BasicInfo);
    component = fixture.componentInstance;
    primengConfig = TestBed.inject(PrimeNG);

    loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.detectChanges();
  });

  it('deve ser criado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve configurar as traduções do PrimeNG para Português no ngOnInit', () => {
    expect(primengConfig.getTranslation('today')).toBe('Hoje');
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

  it('deve atualizar o formulário quando o valor do input de nome do médico mudar', async () => {
    const input = fixture.nativeElement.querySelector('#doctorName');

    input.value = 'Dr. Gregory House';
    input.dispatchEvent(new Event('input'));

    const formValue = mockFormService.form.get('basicInfo.doctorName').value;
    expect(formValue).toBe('Dr. Gregory House');
  });

  it('deve vincular corretamente o controle de idade ao p-inputNumber', async () => {
    const ageHarness = await loader.getHarness(InputNumberHarness);
    expect(await ageHarness.getFormControlName()).toBe('age');
  });

  it('deve vincular corretamente o controle de data ao p-datepicker', async () => {
    const datePickerHarness = await loader.getHarness(DatePickerHarness);

    expect(await datePickerHarness.getFormControlName()).toBe('date');
    expect(await datePickerHarness.getDateFormat()).toBe('dd/mm/yy');
  });

  it('deve ter os atributos aria-required configurados nos inputs de texto', () => {
    const doctorInput = fixture.nativeElement.querySelector('#doctorName');
    const patientInput = fixture.nativeElement.querySelector('#patientName');

    expect(doctorInput.getAttribute('aria-required')).toBe('true');
    expect(patientInput.getAttribute('aria-required')).toBe('true');
  });
});
