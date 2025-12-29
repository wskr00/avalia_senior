import { EvaluationContainer } from '@/components/evaluation-container/evaluation-container';
import { EvaluationOption } from '@/components/evaluation-container/evaluation-section/evaluation-option/evaluation-option';
import { EvaluationSection } from '@/components/evaluation-container/evaluation-section/evaluation-section';
import { HeaderService } from '@/services/header';
import { Component, OnInit, inject } from '@angular/core';

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
