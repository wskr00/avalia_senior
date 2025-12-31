import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Home } from './home';
import { HeaderService } from '@/services/header';
import { provideRouter } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { signal } from '@angular/core';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

describe('Home (Componente)', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let headerService: HeaderService;

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
        providePrimeNG({
          theme: { preset: Aura },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    headerService = TestBed.inject(HeaderService);
    fixture.detectChanges();
  });

  it('deve ser criado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve configurar o título do cabeçalho como "Avalia Senior" no ngOnInit', () => {
    expect(headerService.setTitle).toHaveBeenCalledWith('Avalia Senior');
  });

  it('deve esconder o botão de voltar no ngOnInit', () => {
    expect(headerService.setShowBackButton).toHaveBeenCalledWith(false);
  });

  it('deve exibir o título do card "Escalas de Avaliação"', () => {
    const title = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(title.textContent).toContain('Escalas de Avaliação');
  });

  it('deve ter o link correto para a Escala de Lawton', () => {
    const lawtonBtn = fixture.debugElement.query(By.css('p-button[label="Escala de Lawton"]'));
    expect(lawtonBtn.attributes['routerLink']).toBe('/lawton');
  });

  it('deve ter aria-labels descritivos em todos os botões de escala', () => {
    const buttons = fixture.debugElement.queryAll(By.css('p-button'));

    const expectedLabels = [
      'Acessar Escala de Lawton',
      'Acessar Escala de Katz',
      'Acessar Outra Avaliação',
    ];

    buttons.forEach((btn, index) => {
      const label =
        typeof btn.componentInstance.ariaLabel === 'function'
          ? btn.componentInstance.ariaLabel()
          : btn.componentInstance.ariaLabel;

      expect(label).toBe(expectedLabels[index]);
    });
  });

  it('deve renderizar os botões com a propriedade fluid ativa (largura total)', () => {
    const lawtonBtn = fixture.debugElement.query(By.css('p-button')).componentInstance;
    expect(lawtonBtn.fluid()).toBe(true);
  });
});
