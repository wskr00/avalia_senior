import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SubmitButton } from './submit-button';
import { EvaluationFormService } from '@/services/evaluation-form';
import { signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('SubmitButton', () => {
  let component: SubmitButton;
  let fixture: ComponentFixture<SubmitButton>;

  const mockIsValidSignal = signal(false);

  const mockFormService = {
    isValid: mockIsValidSignal,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitButton, ButtonModule],
      providers: [{ provide: EvaluationFormService, useValue: mockFormService }],
    }).compileComponents();

    fixture = TestBed.createComponent(SubmitButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser criado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve desabilitar o botão quando o formulário for inválido', () => {
    mockIsValidSignal.set(false);
    fixture.detectChanges();

    const pButton = fixture.debugElement.query(By.css('p-button'));

    expect(pButton.componentInstance.disabled).toBe(true);
  });

  it('deve habilitar o botão automaticamente quando o formulário se tornar válido', () => {
    mockIsValidSignal.set(true);
    fixture.detectChanges();

    const pButton = fixture.debugElement.query(By.css('p-button'));

    expect(pButton.componentInstance.disabled).toBe(false);
  });

  it('deve manter o botão desabilitado se o input [disabled] for true, mesmo com formulário válido', () => {
    mockIsValidSignal.set(true);

    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const pButton = fixture.debugElement.query(By.css('p-button'));
    expect(pButton.componentInstance.disabled).toBe(true);
  });

  it('deve repassar a propriedade loading para o p-button', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const pButton = fixture.debugElement.query(By.css('p-button'));
    expect(pButton.componentInstance.loading).toBe(true);
  });

  it('deve emitir o evento onClick quando o método execute for chamado', () => {
    const emitSpy = vi.spyOn(component.onClick, 'emit');

    component.execute();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('não deve permitir o clique se o botão estiver desabilitado (DOM)', () => {
    mockIsValidSignal.set(false);
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.onClick, 'emit');
    const buttonElement = fixture.debugElement.query(By.css('button'));

    buttonElement?.nativeElement.click();

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
