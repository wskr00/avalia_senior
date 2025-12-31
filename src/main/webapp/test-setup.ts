import { vi } from 'vitest';
import '@angular/compiler';
import 'zone.js';
import 'zone.js/testing';

/**
 * Mock Global do matchMedia
 * Necessário para o PrimeNG e ThemeService funcionarem no JSDOM.
 */
vi.stubGlobal(
  'matchMedia',
  vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })
);
