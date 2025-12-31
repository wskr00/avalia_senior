import { vi } from 'vitest';
import '@angular/compiler';
import 'zone.js';
import 'zone.js/testing';

vi.stubGlobal(
  'matchMedia',
  vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })
);
