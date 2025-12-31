import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackButton } from './back-button';
import { provideRouter } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { describe, it, expect, beforeEach } from 'vitest';

import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader, ComponentHarness } from '@angular/cdk/testing';

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

  async getIcon() {
    const host = await this.host();
    return host.getAttribute('icon');
  }

  async getSeverity() {
    const host = await this.host();
    const attr =
      (await host.getAttribute('ng-reflect-severity')) || (await host.getAttribute('severity'));
    if (attr) return attr;

    const classes = await host.getAttribute('class');
    if (classes?.includes('p-button-secondary')) return 'secondary';
    return null;
  }

  async isRounded(): Promise<string> {
    const host = await this.host();
    const reflect = await host.getAttribute('ng-reflect-rounded');
    if (reflect === 'true') return 'true';

    const getInnerEl = this.locatorForOptional('button, a');
    const innerEl = await getInnerEl();

    const hostClasses = await host.getAttribute('class');
    const innerClasses = innerEl ? await innerEl.getAttribute('class') : '';

    if (hostClasses?.includes('p-button-rounded') || innerClasses?.includes('p-button-rounded')) {
      return 'true';
    }
    return 'false';
  }

  async isText(): Promise<string> {
    const host = await this.host();
    const reflect = await host.getAttribute('ng-reflect-text');
    if (reflect === 'true') return 'true';

    const getInnerEl = this.locatorForOptional('button, a');
    const innerEl = await getInnerEl();

    const hostClasses = await host.getAttribute('class');
    const innerClasses = innerEl ? await innerEl.getAttribute('class') : '';

    if (hostClasses?.includes('p-button-text') || innerClasses?.includes('p-button-text')) {
      return 'true';
    }
    return 'false';
  }
}

describe('BackButton', () => {
  let component: BackButton;
  let fixture: ComponentFixture<BackButton>;
  let loader: HarnessLoader;

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
    await fixture.whenStable();
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

    expect(await button.getIcon()).toBe('pi pi-arrow-left');
    expect(await button.getSeverity()).toBe('secondary');
    expect(await button.isRounded()).toBe('true');
    expect(await button.isText()).toBe('true');
  });
});
