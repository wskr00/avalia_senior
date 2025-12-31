import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { HeaderService } from '@/services/header';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';

describe('App (Root)', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

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
        providePrimeNG({
          theme: { preset: Aura },
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser criado com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve conter o componente de cabeçalho (app-header)', () => {
    const header = fixture.debugElement.query(By.css('app-header'));
    expect(header).not.toBeNull();
  });

  it('deve conter o local de carregamento das rotas (router-outlet)', () => {
    const outlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(outlet).not.toBeNull();
  });

  it('deve renderizar o cabeçalho antes do conteúdo das rotas', () => {
    const element = fixture.nativeElement;
    const children = element.children;

    expect(children[0].tagName.toLowerCase()).toBe('app-header');
    expect(element.querySelector('router-outlet')).toBeTruthy();
  });
});
