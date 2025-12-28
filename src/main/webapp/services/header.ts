import { Injectable, signal } from '@angular/core';

export type HeaderContext = 'home' | 'form' | 'result';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  title = signal<string>('');
  context = signal<HeaderContext>('home');

  setTitle(value: string): void {
    this.title.set(value);
  }

  setContext(value: HeaderContext): void {
    this.context.set(value);
  }
}
