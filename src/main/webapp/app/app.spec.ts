import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { App } from './app';
import { provideRouter, RouterOutlet } from '@angular/router';
import { signal, Component } from '@angular/core';
import { HeaderService } from '@/services/header';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
// 'beforeAll' e 'vi' (para matchMedia) removidos pois agora são globais no test-setup.ts
import { describe, it, expect, beforeEach } from 'vitest';

/**
 * 1. Mock para o Header.
 * Isolamos o AppComponent para garantir que ele renderiza a estrutura
 * correta (Header + RouterOutlet) sem carregar a lógica interna do cabeçalho.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  template: '<header>Mock Header</header>',
})
class MockHeader {}

describe('App (Root)', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    const headerServiceMock = {
      title: signal('Avalia Senior'),
      showBackButton: signal(false),
      setTitle: (t: string) => {}, // Stub simples
      setShowBackButton: (b: boolean) => {},
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: HeaderService, useValue: headerServiceMock },
        providePrimeNG({
          theme: { preset: Aura },
        }),
      ],
      // SEM NO_ERRORS_SCHEMA: O compilador validará se as tags no template do App são conhecidas
    })
      .overrideComponent(App, {
        // Trocamos o Header real pelo Mock apenas neste ambiente de teste
        add: { imports: [MockHeader] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser criado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve conter o componente de cabeçalho (app-header)', () => {
    // Busca pela diretiva do Mock garante que o Angular resolveu a tag corretamente
    const header = fixture.debugElement.query(By.directive(MockHeader));
    expect(header).not.toBeNull();
  });

  it('deve conter o local de carregamento das rotas (router-outlet)', () => {
    // RouterOutlet é uma diretiva padrão; validamos sua presença no template
    const outlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(outlet).not.toBeNull();
  });

  it('deve renderizar o cabeçalho antes do conteúdo das rotas', () => {
    const element = fixture.nativeElement as HTMLElement;
    const children = element.children;

    // Garante que o usuário sempre verá o cabeçalho no topo, independente da rota
    expect(children[0].tagName.toLowerCase()).toBe('app-header');

    // Confirma que o contêiner de rotas existe no DOM final
    expect(element.querySelector('router-outlet')).toBeTruthy();
  });
});
