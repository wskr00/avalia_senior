import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-back-button',
  imports: [ButtonModule],
  templateUrl: './back-button.html',
  styleUrl: './back-button.scss',
})
export class BackButton {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
