import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';
import { HeaderService } from '@/services/header';
import { provideRouter } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { signal } from '@angular/core';
// Importamos apenas o necessário. 'beforeAll' e o stub de 'matchMedia' foram removidos
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader, ComponentHarness } from '@angular/cdk/testing';

/**
 * Harness customizado para o p-button.
 * Abstrai a estrutura interna do PrimeNG, tornando o teste resiliente a atualizações.
 */
class PrimeButtonHarness extends ComponentHarness {
  static hostSelector = 'p-button';

  async getLabel(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('label');
  }

  async getAriaLabel(): Promise<string | null> {
    const host = await this.host();
    return (await host.getAttribute('aria-label')) || (await host.getAttribute('arialabel'));
  }

  async getRouterLink(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('routerLink');
  }
}

describe('Home (Componente)', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let headerService: HeaderService;
  let loader: HarnessLoader;

  beforeEach(async () => {
    const headerServiceMock = {
      setTitle: vi.fn(),
      setShowBackButton: vi.fn(),
      title: signal('Avalia Senior'),
      showBackButton: signal(false),
    };

    await TestBed.configureTestingModule({
      imports: [Home, ButtonModule, CardModule],
      providers: [
        { provide: HeaderService, useValue: headerServiceMock },
        provideRouter([{ path: 'lawton', component: class {} }]),
        providePrimeNG({ theme: { preset: Aura } }),
      ],
      // SEM NO_ERRORS_SCHEMA: O Angular agora valida cada tag e input no template
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    headerService = TestBed.inject(HeaderService);

    // Inicializa o loader do CDK para buscar os harnesses
    loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.detectChanges();
  });

  it('deve ser criado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve configurar o título do cabeçalho como "Avalia Senior" no ngOnInit', () => {
    expect(headerService.setTitle).toHaveBeenCalledWith('Avalia Senior');
  });

  it('deve ter o link correto para a Escala de Lawton', async () => {
    const buttons = await loader.getAllHarnesses(PrimeButtonHarness);

    let lawtonBtn;
    for (const btn of buttons) {
      if ((await btn.getLabel()) === 'Escala de Lawton') {
        lawtonBtn = btn;
        break;
      }
    }

    expect(lawtonBtn).toBeDefined();
    expect(await lawtonBtn?.getRouterLink()).toBe('/lawton');
  });

  it('deve ter aria-labels descritivos em todos os botões de escala', async () => {
    const buttons = await loader.getAllHarnesses(PrimeButtonHarness);

    const expectedLabels = [
      'Acessar Escala de Lawton',
      'Acessar Escala de Katz',
      'Acessar Outra Avaliação',
    ];

    for (let i = 0; i < buttons.length; i++) {
      const label = await buttons[i].getAriaLabel();
      expect(label).toBe(expectedLabels[i]);
    }
  });

  it('deve renderizar os botões com a propriedade fluid ativa', async () => {
    const button = await loader.getHarness(PrimeButtonHarness);
    const host = await button.host();

    // Verificamos a classe CSS aplicada pelo PrimeNG
    expect(await host.hasClass('p-button-fluid')).toBe(true);
  });
});
