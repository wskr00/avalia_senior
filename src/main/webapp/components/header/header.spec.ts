import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Header } from './header';
import { HeaderService } from '@/services/header';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { signal, NO_ERRORS_SCHEMA } from '@angular/core';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';

describe('Header (Componente)', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  const titleMock = signal('Título Inicial');
  const showBackButtonMock = signal(true);

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
    const mockHeaderService = {
      title: titleMock,
      showBackButton: showBackButtonMock,
    };

    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        { provide: HeaderService, useValue: mockHeaderService },
        provideRouter([]),
        providePrimeNG({
          theme: { preset: Aura },
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;

    titleMock.set('Título Inicial');
    showBackButtonMock.set(true);

    fixture.detectChanges();
  });

  it('deve ser criado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o título dinamicamente conforme o sinal do HeaderService', () => {
    const h1 = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(h1.textContent).toContain('Título Inicial');

    titleMock.set('Nova Escala');
    fixture.detectChanges();

    expect(h1.textContent).toContain('Nova Escala');
  });

  it('deve renderizar o app-back-button quando showBackButton for true', () => {
    showBackButtonMock.set(true);
    fixture.detectChanges();

    const backButton = fixture.debugElement.query(By.css('app-back-button'));
    expect(backButton).not.toBeNull();
  });

  it('NÃO deve renderizar o app-back-button quando showBackButton for false', () => {
    showBackButtonMock.set(false);
    fixture.detectChanges();

    const backButton = fixture.debugElement.query(By.css('app-back-button'));
    expect(backButton).toBeNull();
  });

  it('deve sempre renderizar o componente de alternância de tema (app-theme-toggle)', () => {
    const themeToggle = fixture.debugElement.query(By.css('app-theme-toggle'));
    expect(themeToggle).not.toBeNull();
  });
});
