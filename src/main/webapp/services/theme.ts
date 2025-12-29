import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);

  isDarkMode = signal<boolean>(this.getInitialTheme());

  constructor() {
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        const html = document.documentElement;
        const darkMode = this.isDarkMode();

        if (darkMode) {
          html.classList.add('app-dark');
        } else {
          html.classList.remove('app-dark');
        }

        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
      }
    });
  }

  toggleTheme(): void {
    this.isDarkMode.update((mode) => !mode);
  }

  private getInitialTheme(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  }
}
