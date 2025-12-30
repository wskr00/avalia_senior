import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
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

  initializeResponses(count: number): void {
    const responsesArray = this.responses;
    const currentLength = responsesArray.length;

    if (currentLength < count) {
      // Adiciona apenas a diferença
      for (let i = currentLength; i < count; i++) {
        responsesArray.push(new FormControl(null, Validators.required));
      }
    } else if (currentLength > count) {
      // Remove apenas o excedente do final
      for (let i = currentLength; i > count; i--) {
        responsesArray.removeAt(i - 1);
      }
    }
  }

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
