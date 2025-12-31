import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Header } from './header';
import { HeaderService } from '@/services/header';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { signal, Component } from '@angular/core';
import { provideRouter } from '@angular/router';
// 'beforeAll' e 'vi' (para matchMedia) removidos pois agora são globais
import { describe, it, expect, beforeEach, vi } from 'vitest';

// 1. Mocks para os componentes filhos (Stubs)
// Garantem que o template seja validado sem carregar dependências pesadas
@Component({
  selector: 'app-back-button',
  standalone: true,
  template: '<button>Mock Back Button</button>',
})
class MockBackButton {}

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: '<div>Mock Theme Toggle</div>',
})
class MockThemeToggle {}

describe('Header (Componente)', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  // Sinais mockados para controle de estado reativo
  const titleMock = signal('Título Inicial');
  const showBackButtonMock = signal(true);

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
      // SEM NO_ERRORS_SCHEMA: O Angular validará app-back-button e app-theme-toggle
    })
      .overrideComponent(Header, {
        // Substituímos os componentes reais pelos Mocks no template do Header
        add: { imports: [MockBackButton, MockThemeToggle] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;

    // Resetamos os sinais para o estado inicial antes de cada teste
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

    // Alteração do sinal deve refletir no DOM após detectChanges
    titleMock.set('Nova Escala');
    fixture.detectChanges();

    expect(h1.textContent).toContain('Nova Escala');
  });

  it('deve renderizar o app-back-button quando showBackButton for true', () => {
    showBackButtonMock.set(true);
    fixture.detectChanges();

    // By.directive é mais seguro que By.css para componentes
    const backButton = fixture.debugElement.query(By.directive(MockBackButton));
    expect(backButton).not.toBeNull();
  });

  it('NÃO deve renderizar o app-back-button quando showBackButton for false', () => {
    showBackButtonMock.set(false);
    fixture.detectChanges();

    const backButton = fixture.debugElement.query(By.directive(MockBackButton));
    expect(backButton).toBeNull();
  });

  it('deve sempre renderizar o componente de alternância de tema (app-theme-toggle)', () => {
    const themeToggle = fixture.debugElement.query(By.directive(MockThemeToggle));
    expect(themeToggle).not.toBeNull();
  });
});
