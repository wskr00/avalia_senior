import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  title = signal<string>('');
  showBackButton = signal<boolean>(true);

  setTitle(value: string): void {
    this.title.set(value);
  }

  setShowBackButton(show: boolean) {
    this.showBackButton.set(show);
  }
}
