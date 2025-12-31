import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { App } from './app';
import { Header } from '@/components/header/header';
import { provideRouter, RouterOutlet } from '@angular/router';
import { signal, Component } from '@angular/core';
import { HeaderService } from '@/services/header';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { describe, it, expect, beforeEach, vi } from 'vitest';

@Component({
  selector: 'app-header',
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
      setTitle: vi.fn(),
      setShowBackButton: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: HeaderService, useValue: headerServiceMock },
        providePrimeNG({ theme: { preset: Aura } }),
      ],
    })
      .overrideComponent(App, {
        remove: { imports: [Header] },
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
    const header = fixture.debugElement.query(By.directive(MockHeader));
    expect(header).not.toBeNull();
  });

  it('deve conter o local de carregamento das rotas (router-outlet)', () => {
    const outlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(outlet).not.toBeNull();
  });

  it('deve renderizar o cabeçalho antes do conteúdo das rotas', () => {
    const element = fixture.nativeElement as HTMLElement;
    const children = element.children;

    expect(children[0].tagName.toLowerCase()).toBe('app-header');
    expect(element.querySelector('router-outlet')).toBeTruthy();
  });
});
