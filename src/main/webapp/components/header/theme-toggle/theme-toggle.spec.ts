import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ThemeToggle } from './theme-toggle';
import { ThemeService } from '@/services/theme';
import { signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('ThemeToggle', () => {
  let component: ThemeToggle;
  let fixture: ComponentFixture<ThemeToggle>;
  let mockThemeService: any;

  const isDarkModeMock = signal(false);

  beforeEach(async () => {
    mockThemeService = {
      isDarkMode: isDarkModeMock,
      toggleTheme: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ThemeToggle, ButtonModule],
      providers: [{ provide: ThemeService, useValue: mockThemeService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggle);
    component = fixture.componentInstance;

    isDarkModeMock.set(false);
    fixture.detectChanges();
  });

  it('deve ser criado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o ícone de lua e label para tema escuro quando no modo claro', () => {
    const pButton = fixture.debugElement.query(By.css('p-button')).componentInstance;

    expect(pButton.icon).toBe('pi pi-moon');
    expect(component['ariaLabel']()).toBe('Alternar para tema escuro');
  });

  it('deve atualizar o ícone para sol e label para tema claro quando o sinal mudar', () => {
    isDarkModeMock.set(true);
    fixture.detectChanges();

    const pButton = fixture.debugElement.query(By.css('p-button')).componentInstance;

    expect(pButton.icon).toBe('pi pi-sun');
    expect(component['ariaLabel']()).toBe('Alternar para tema claro');
  });

  it('deve chamar o método toggleTheme do serviço ao clicar no botão', () => {
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;

    buttonElement.click();

    expect(mockThemeService.toggleTheme).toHaveBeenCalled();
  });

  it('deve repassar o aria-label computado para o botão nativo', () => {
    isDarkModeMock.set(false);
    fixture.detectChanges();

    const pButton = fixture.debugElement.query(By.css('p-button'));

    expect(pButton.componentInstance.ariaLabel).toBe('Alternar para tema escuro');
  });
});
