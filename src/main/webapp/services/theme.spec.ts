import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme';
import { PLATFORM_ID } from '@angular/core';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('ThemeService', () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    };
  })();

  const mockMatchMedia = (matches: boolean) => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        matches,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })
    );
  };

  beforeEach(() => {
    vi.stubGlobal('localStorage', localStorageMock);
    localStorageMock.clear();

    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })
    );

    document.documentElement.classList.remove('app-dark');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  describe('Inicialização no Navegador', () => {
    const setup = () => {
      TestBed.configureTestingModule({
        providers: [ThemeService, { provide: PLATFORM_ID, useValue: 'browser' }],
      });
      const service = TestBed.inject(ThemeService);
      TestBed.flushEffects();
      return service;
    };

    it('deve carregar o tema escuro se estiver salvo no localStorage', () => {
      localStorageMock.setItem('theme', 'dark');
      const service = setup();
      expect(service.isDarkMode()).toBe(true);
    });

    it('deve carregar o tema claro se estiver salvo no localStorage', () => {
      localStorageMock.setItem('theme', 'light');
      const service = setup();
      expect(service.isDarkMode()).toBe(false);
    });

    it('deve respeitar a preferência do sistema se o localStorage estiver vazio', () => {
      mockMatchMedia(true);
      const service = setup();
      expect(service.isDarkMode()).toBe(true);
    });
  });

  describe('Funcionalidades e Efeitos', () => {
    let service: ThemeService;

    beforeEach(() => {
      mockMatchMedia(false);
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

    it('deve adicionar a classe "app-dark" ao HTML quando o modo escuro estiver ativo', () => {
      if (!service.isDarkMode()) {
        service.toggleTheme();
      }

      TestBed.flushEffects();

      expect(document.documentElement.classList.contains('app-dark')).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('deve remover a classe "app-dark" ao voltar para o modo claro', () => {
      if (!service.isDarkMode()) {
        service.toggleTheme();
        TestBed.flushEffects();
      }

      service.toggleTheme();

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
