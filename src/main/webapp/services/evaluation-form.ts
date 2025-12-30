import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ScaleDefinition, EvaluationBasicInfo } from '@/interfaces/evaluation';

@Injectable()
export class EvaluationFormService {
  private fb = inject(FormBuilder);

  private _scaleConfig?: ScaleDefinition;

  form: FormGroup = this.fb.group({
    basicInfo: this.fb.group({
      doctorName: ['', Validators.required],
      patientName: ['', Validators.required],
      age: [null, Validators.required],
      date: [new Date(), Validators.required],
    }),
    responses: this.fb.array([]),
  });

  setScaleConfig(config: ScaleDefinition) {
    this._scaleConfig = config;
  }

  get scaleConfig() {
    return this._scaleConfig;
  }

  get responses(): FormArray {
    return this.form.get('responses') as FormArray;
  }

  get basicInfoValue(): EvaluationBasicInfo {
    return this.form.controls['basicInfo'].getRawValue() as EvaluationBasicInfo;
  }

  patchBasicInfo(info: Partial<EvaluationBasicInfo>) {
    this.form.get('basicInfo')?.patchValue(info);
  }
}
