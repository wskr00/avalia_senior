import { TestBed } from '@angular/core/testing';
import { HeaderService } from './header';
import { describe, it, expect, beforeEach } from 'vitest';

describe('HeaderService', () => {
  let service: HeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeaderService],
    });
    service = TestBed.inject(HeaderService);
  });

  it('deve ser criado com sucesso', () => {
    expect(service).toBeTruthy();
  });

  describe('Valores Iniciais', () => {
    it('deve iniciar com o título vazio', () => {
      expect(service.title()).toBe('');
    });

    it('deve iniciar com o botão de voltar habilitado (true) por padrão', () => {
      expect(service.showBackButton()).toBe(true);
    });
  });

  describe('Gerenciamento de Estado', () => {
    it('deve atualizar o título através do método setTitle', () => {
      const novoTitulo = 'Avaliação de Lawton';
      service.setTitle(novoTitulo);

      expect(service.title()).toBe(novoTitulo);
    });

    it('deve permitir limpar o título definindo uma string vazia', () => {
      service.setTitle('Título');
      service.setTitle('');

      expect(service.title()).toBe('');
    });

    it('deve atualizar a visibilidade do botão de voltar', () => {
      service.setShowBackButton(false);
      expect(service.showBackButton()).toBe(false);

      service.setShowBackButton(true);
      expect(service.showBackButton()).toBe(true);
    });
  });

  describe('Persistência de Sinais', () => {
    it('deve manter o estado atualizado após múltiplas chamadas', () => {
      service.setTitle('Primeiro');
      service.setTitle('Segundo');
      service.setShowBackButton(false);

      expect(service.title()).toBe('Segundo');
      expect(service.showBackButton()).toBe(false);
    });
  });
});
