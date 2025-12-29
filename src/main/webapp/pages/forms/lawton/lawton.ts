import { Component, OnInit, inject } from '@angular/core';
import { HeaderService } from '@/services/header';
import { EvaluationContainer } from '@/components/evaluation-container/evaluation-container';
import { EvaluationSection } from '@/components/evaluation-container/evaluation-section/evaluation-section';
import { EvaluationOption } from '@/components/evaluation-container/evaluation-section/evaluation-option/evaluation-option';

@Component({
  selector: 'app-lawton',
  imports: [EvaluationContainer, EvaluationSection, EvaluationOption],
  templateUrl: './lawton.html',
  styleUrl: './lawton.scss',
})
export class Lawton implements OnInit {
  private headerService = inject(HeaderService);

  ngOnInit(): void {
    this.headerService.setTitle('Escala de Lawton');
  }

  handleFinish(data: any): void {
    console.log('Dados recebidos da Escala de Lawton:', data);

    // TODO: result
  }
}
