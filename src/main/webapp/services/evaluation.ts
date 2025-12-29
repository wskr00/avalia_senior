import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class EvaluationService {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    basicInfo: this.fb.group({
      doctorName: ['', Validators.required],
      patientName: ['', Validators.required],
      age: [null, Validators.required],
      date: [new Date(), Validators.required],
    }),
    responses: this.fb.array([]),
  });

  get responses() {
    return this.form.get('responses');
  }
}
