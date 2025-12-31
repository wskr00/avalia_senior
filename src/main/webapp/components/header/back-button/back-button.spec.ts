import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackButton } from './back-button';
import { provideRouter } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { describe, it, expect, beforeEach } from 'vitest';

// 1. Importações do CDK e definição do Harness Customizado
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader, ComponentHarness } from '@angular/cdk/testing';

/**
 * Harness para o p-button.
 * Centraliza a lógica de busca de atributos e estados do PrimeNG.
 */
class PrimeButtonHarness extends ComponentHarness {
  static hostSelector = 'p-button';

  async getAriaLabel() {
    const host = await this.host();
    return (await host.getAttribute('aria-label')) || (await host.getAttribute('arialabel'));
  }

  async getRouterLink() {
    const host = await this.host();
    return host.getAttribute('routerLink');
  }

  async hasClass(className: string) {
    const host = await this.host();
    return host.hasClass(className);
  }

  async getIcon() {
    const host = await this.host();
    return host.getAttribute('icon');
  }
}

describe('BackButton', () => {
  let component: BackButton;
  let fixture: ComponentFixture<BackButton>;
  let loader: HarnessLoader;

  // O matchMedia foi removido daqui pois agora reside no test-setup.ts global

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
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('deve ser criado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve apontar para a rota raiz ("/")', async () => {
    const button = await loader.getHarness(PrimeButtonHarness);
    expect(await button.getRouterLink()).toBe('/');
  });

  it('deve ter o aria-label correto para leitores de tela', async () => {
    const button = await loader.getHarness(PrimeButtonHarness);
    expect(await button.getAriaLabel()).toBe('Voltar para a página anterior');
  });

  it('deve renderizar com o ícone de seta para a esquerda e estilo correto', async () => {
    const button = await loader.getHarness(PrimeButtonHarness);

    // Verificamos o ícone via atributo
    expect(await button.getIcon()).toBe('pi pi-arrow-left');

    // Verificamos o estilo PrimeNG via classes CSS que o componente aplica
    // Isso é mais robusto do que acessar a instância do componente
    expect(await button.hasClass('p-button-secondary')).toBe(true);
    expect(await button.hasClass('p-button-text')).toBe(true);
    expect(await button.hasClass('p-button-rounded')).toBe(true);
  });
});
