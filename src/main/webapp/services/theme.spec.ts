import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme';
import { PLATFORM_ID } from '@angular/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('ThemeService', () => {
  // 1. Mock do localStorage mais limpo usando as próprias utilidades do Vitest
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
  };

  beforeEach(() => {
    vi.stubGlobal('localStorage', localStorageMock);
    vi.clearAllMocks();

    // Resetamos o estado do DOM para garantir isolamento entre testes
    document.documentElement.classList.remove('app-dark');
  });

  // Nota: Removido vi.unstubAllGlobals() para não matar o matchMedia global
  // que outros arquivos .spec.ts precisam.

  describe('Inicialização no Navegador', () => {
    const setup = (platform: 'browser' | 'server' = 'browser') => {
      TestBed.configureTestingModule({
        providers: [ThemeService, { provide: PLATFORM_ID, useValue: platform }],
      });
      const service = TestBed.inject(ThemeService);
      // flushEffects garante que o effect() inicial do Signal rode
      TestBed.flushEffects();
      return service;
    };

    it('deve carregar o tema escuro se estiver salvo no localStorage', () => {
      localStorageMock.getItem.mockReturnValue('dark');
      const service = setup();

      expect(service.isDarkMode()).toBe(true);
    });

    it('deve carregar o tema claro se estiver salvo no localStorage', () => {
      localStorageMock.getItem.mockReturnValue('light');
      const service = setup();

      expect(service.isDarkMode()).toBe(false);
    });

    it('deve respeitar a preferência do sistema se o localStorage estiver vazio', () => {
      // Sobrescrevemos o mock global apenas para este teste específico
      vi.stubGlobal(
        'matchMedia',
        vi.fn().mockReturnValue({
          matches: true, // Simula preferência do sistema por Dark Mode
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })
      );

      localStorageMock.getItem.mockReturnValue(null);
      const service = setup();

      expect(service.isDarkMode()).toBe(true);
    });
  });

  describe('Funcionalidades e Efeitos', () => {
    let service: ThemeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [ThemeService, { provide: PLATFORM_ID, useValue: 'browser' }],
      });
      service = TestBed.inject(ThemeService);
      TestBed.flushEffects();
    });

    it('deve alternar o tema ao chamar toggleTheme', () => {
      const initialMode = service.isDarkMode();
      service.toggleTheme();

      expect(service.isDarkMode()).toBe(!initialMode);
    });

    it('deve atualizar o HTML e o localStorage ao ativar o modo escuro', () => {
      // Forçamos a mudança para Dark se estiver Light
      if (!service.isDarkMode()) {
        service.toggleTheme();
      }

      TestBed.flushEffects(); // Dispara o effect() do Signal

      expect(document.documentElement.classList.contains('app-dark')).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('deve atualizar o HTML e o localStorage ao ativar o modo claro', () => {
      // Garante estado inicial escuro
      if (!service.isDarkMode()) {
        service.toggleTheme();
        TestBed.flushEffects();
      }

      service.toggleTheme(); // Muda para claro
      TestBed.flushEffects();

      expect(document.documentElement.classList.contains('app-dark')).toBe(false);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
    });
  });

  describe('Inicialização no Servidor (SSR)', () => {
    it('deve retornar falso e não acessar APIs do browser quando estiver no servidor', () => {
      TestBed.configureTestingModule({
        providers: [ThemeService, { provide: PLATFORM_ID, useValue: 'server' }],
      });

      const service = TestBed.inject(ThemeService);
      TestBed.flushEffects();

      expect(service.isDarkMode()).toBe(false);
      expect(localStorageMock.getItem).not.toHaveBeenCalled();
    });
  });
});
