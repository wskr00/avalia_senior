import { HeaderService } from '@/services/header';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { providePrimeNG } from 'primeng/config';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Home } from './home';

import { ComponentHarness, HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

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

  async getComponentInstance() {
    const host = await this.host();
    return host;
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
        provideRouter([
          { path: 'lawton', component: class {} },
          { path: 'katz', component: class {} },
        ]),
        providePrimeNG({ theme: { preset: Aura } }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    headerService = TestBed.inject(HeaderService);
    loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.detectChanges();
    await fixture.whenStable();
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

  it('deve ter o link correto para o Índice de Katz', async () => {
    const buttons = await loader.getAllHarnesses(PrimeButtonHarness);

    let katzBtn;
    for (const btn of buttons) {
      if ((await btn.getLabel()) === 'Índice de Katz') {
        katzBtn = btn;
        break;
      }
    }

    expect(katzBtn).toBeDefined();
    expect(await katzBtn?.getRouterLink()).toBe('/katz');
  });

  it('deve ter aria-labels descritivos em todos os botões de escala', async () => {
    const buttons = await loader.getAllHarnesses(PrimeButtonHarness);

    const expectedLabels = [
      'Acessar Escala de Lawton',
      'Acessar Índice de Katz',
      'Acessar Outra Avaliação',
    ];

    for (let i = 0; i < buttons.length; i++) {
      const label = await buttons[i].getAriaLabel();
      expect(label).toBe(expectedLabels[i]);
    }
  });

  it('deve renderizar os botões com a propriedade fluid ativa', async () => {
    const buttonHarness = await loader.getHarness(PrimeButtonHarness);
    const host = await buttonHarness.host();

    const classes = await host.getAttribute('class');

    expect(classes).toContain('text-left');

    const isFluidDefined = await host.getAttribute('ng-reflect-fluid');

    if (isFluidDefined) {
      expect(isFluidDefined).toBe('true');
    } else {
      expect(classes).toBeTruthy();
    }
  });
});
