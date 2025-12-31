import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BackButton } from './back-button';
import { provideRouter } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';

describe('BackButton', () => {
  let component: BackButton;
  let fixture: ComponentFixture<BackButton>;

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
    await TestBed.configureTestingModule({
      imports: [BackButton, ButtonModule],
      providers: [
        provideRouter([]),
        providePrimeNG({
          theme: { preset: Aura },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BackButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser criado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve apontar para a rota raiz ("/")', () => {
    const pButton = fixture.debugElement.query(By.css('p-button'));
    expect(pButton.attributes['routerLink']).toBe('/');
  });

  it('deve ter o aria-label correto para leitores de tela', () => {
    const pButton = fixture.debugElement.query(By.css('p-button')).componentInstance;

    const label = typeof pButton.ariaLabel === 'function' ? pButton.ariaLabel() : pButton.ariaLabel;
    expect(label).toBe('Voltar para a página anterior');
  });

  it('deve renderizar com o ícone de seta para a esquerda e estilo correto', () => {
    const pButton = fixture.debugElement.query(By.css('p-button')).componentInstance;

    const icon = typeof pButton.icon === 'function' ? pButton.icon() : pButton.icon;
    const severity = typeof pButton.severity === 'function' ? pButton.severity() : pButton.severity;
    const isText = typeof pButton.text === 'function' ? pButton.text() : pButton.text;
    const isRounded = typeof pButton.rounded === 'function' ? pButton.rounded() : pButton.rounded;

    expect(icon).toBe('pi pi-arrow-left');
    expect(severity).toBe('secondary');
    expect(isText).toBe(true);
    expect(isRounded).toBe(true);
  });
});
